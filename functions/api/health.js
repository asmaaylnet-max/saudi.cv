export async function onRequestGet({ env }) {
  try {
    if (!env.DB || !env.MEDIA) throw new Error('Required staging binding is unavailable');
    const row = await env.DB.prepare('SELECT 1 AS healthy').first();
    if (row?.healthy !== 1) throw new Error('Staging database health query failed');

    return Response.json(
      { status: 'ok' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer'
        }
      }
    );
  } catch {
    return Response.json(
      { status: 'unavailable' },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer'
        }
      }
    );
  }
}
