const HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};

function response(body, status, extraHeaders = {}) {
  return Response.json(body, {
    status,
    headers: { ...HEADERS, ...extraHeaders }
  });
}

function constantTimeEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let i = 0; i < length; i += 1) {
    difference |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return difference === 0;
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return response({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
  }

  const expectedToken = env.R2_HEALTH_TOKEN;
  const authorization = request.headers.get('Authorization') || '';
  const suppliedToken = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';

  // Deliberately indistinguishable when the route is disabled or the token is wrong.
  if (!expectedToken || !constantTimeEqual(suppliedToken, expectedToken)) {
    return response({ error: 'Not found' }, 404);
  }

  if (!env.MEDIA) return response({ status: 'unavailable' }, 503);

  const objectKey = `staging-health/${crypto.randomUUID()}.txt`;
  const marker = crypto.randomUUID();

  try {
    await env.MEDIA.put(objectKey, marker, {
      httpMetadata: { contentType: 'text/plain; charset=utf-8' },
      customMetadata: { purpose: 'temporary-staging-health-check' }
    });

    const object = await env.MEDIA.get(objectKey);
    if (!object || (await object.text()) !== marker) {
      throw new Error('R2 read-back did not match the temporary marker');
    }

    await env.MEDIA.delete(objectKey);
    if (await env.MEDIA.head(objectKey)) {
      throw new Error('R2 object remained after deletion');
    }

    return response({ status: 'ok', operations: ['write', 'read', 'delete'] }, 200);
  } catch {
    // Best-effort cleanup uses only the unique key created by this request.
    try {
      await env.MEDIA.delete(objectKey);
    } catch {
      // Do not expose storage errors or temporary object details to callers.
    }
    return response({ status: 'unavailable' }, 503);
  }
}
