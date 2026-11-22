# بيئة الاختبار المؤقتة

رابط Cloudflare Pages المؤقت هو https://saudi-cv-staging.pages.dev. المشروع مخصص لـstaging فقط؛ لا نطاق مخصص، ولا تعديل DNS، ولا نشر إنتاجي. لا يستخدم مشروع Manus المنشور السابق.

المشروع يتصل بقاعدة D1 وbucket R2 جديدتين ومعزولتين باسم Saudi CV staging. بدأ الموردان فارغين ولا توجد حالياً حسابات مستخدمين أو وسائط أو جداول تطبيق.

المسار `GET /api/health` ينفذ `SELECT 1` على D1 ويتحقق من توفر binding لـR2 فقط؛ ولا يثبت I/O على R2. أضيف مسار `POST /api/staging/r2-check` للتحقق من الكتابة والقراءة والحذف عبر binding التطبيق. في 2026-11-22، أعاد الفحص البعيد على deployment `4d6c8aa1` الحالة `200` مع `write` و`read` و`delete`، ثم حذف الكائن المؤقت. أُضيف secret عشوائي مؤقت وقت الفحص وحُذف بعده؛ قائمة أسرار المشروع فارغة حالياً، والمسار يعيد `404` دون secret. لا يعيد المسار المفتاح أو محتوى الكائن.

## البريد والتحقق من الحساب

Cloudflare Email Service في Public Beta. الإرسال إلى مستلمين غير محددين يتطلب Workers Paid، بينما الإرسال إلى عنوان وجهة موثّق قد يكون مجانياً. يتطلب الإرسال تهيئة نطاق باستخدام Cloudflare DNS وإعداد سجلات bounce وSPF وDKIM وDMARC. وثائق Pages Functions لا تعرض `send_email` ضمن bindings المدعومة مباشرة؛ قد يتطلب ذلك Worker مستقلاً وربط خدمة، بالإضافة إلى نطاق مرسل معتمد. أكد المالك في 2026-11-22 الإبقاء على منع DNS وترك البريد وOTP والتسجيل الفعلي معطلة حالياً. لا يلزم تفعيل Resend، ولم يُضف نطاق أو يجرَ إرسال بريد.

الواجهة العامة توضّح أن التسجيل والبحث غير موصولين. لا يوجد بريد تجريبي ولا OTP ثابت ولا حساب أو سجل شخصي.

## فحص R2 المؤقت من الطرفية

بعد النشر، عيّن قيمة عشوائية عالية entropy كـCloudflare Pages Secret باسم `R2_HEALTH_TOKEN` لمشروع `saudi-cv-staging` باستخدام Wrangler. احتفظ بالقيمة في طرفيتك فقط، ثم نفّذ الاستدعاء التالي. لا تضعها في Git أو في سجل أو مخرجات عامة:

```sh
curl -X POST https://saudi-cv-staging.pages.dev/api/staging/r2-check \
  -H "Authorization: Bearer $R2_HEALTH_TOKEN"
```

يتوقع نجاح الفحص `200` مع `write` و`read` و`delete`. عدم وجود السر أو خطؤه يعطي `404`، وأي إخفاق في التخزين يعطي `503` دون تسريب تفاصيل التخزين. بعد الفحص احذف السر من مشروع Pages staging فوراً؛ عندها يعود المسار إلى `404`. هذا المسار للفحص الفني فقط، وليس واجهة للمستخدمين.

## النشر من جذر المستودع

بعد `pnpm build`، شغّل Wrangler من جذر المستودع لكي يكتشف `wrangler.toml` و`functions/` تلقائياً:

```sh
pnpm dlx wrangler@4.166.0 pages deploy ./dist --project-name=saudi-cv-staging --branch=main --commit-dirty=true
```

لا تمرر خيار `--config`؛ Pages لا يدعم مساراً مخصصاً لملف Wrangler في هذا الأمر. يحتاج النشر إلى اعتماد Cloudflare قائم في البيئة. لا تُودع رمز API أو أي ملف اعتماد في Git، ولا تغيّر موارد D1/R2 إلى موارد إنتاجية.

## مراجع Cloudflare الرسمية

- [Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [إعداد Pages Functions وWrangler](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)
- [ربط D1 وR2 بوظائف Pages](https://developers.cloudflare.com/pages/functions/bindings/)
- [Cloudflare Email Service](https://developers.cloudflare.com/email-service/)
- [إعداد الإرسال والنطاق](https://developers.cloudflare.com/email-service/get-started/send-emails/)
- [الأسعار والخطط](https://developers.cloudflare.com/email-service/platform/pricing/)
- [واجهات الإرسال في Workers](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/)
