# بيئة الاختبار المؤقتة

رابط Cloudflare Pages المؤقت هو https://saudi-cv-staging.pages.dev. المشروع مخصص لـstaging فقط؛ لا نطاق مخصص، ولا تعديل DNS، ولا نشر إنتاجي. لا يستخدم مشروع Manus المنشور السابق.

المشروع يتصل بقاعدة D1 وbucket R2 جديدتين ومعزولتين باسم Saudi CV staging. بدأ الموردان فارغين ولا توجد حالياً حسابات مستخدمين أو وسائط أو جداول تطبيق.

المسار `GET /api/health` فحص تقني محدود: ينفذ `SELECT 1` على D1 ويتحقق من توفر binding لـR2 في بيئة التشغيل، دون قراءة أو كتابة ملفات أو بيانات مستخدمين. لا يثبت هذا الفحص صلاحيات قراءة/كتابة كائنات R2 ولا يجعل تدفقات المنتج فعالة. البريد وOTP غير مفعّلين لعدم إثبات نطاق مرسل موثّق وإرسال حقيقي. وتوضح الواجهة أن التسجيل والبحث غير موصولين.

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
