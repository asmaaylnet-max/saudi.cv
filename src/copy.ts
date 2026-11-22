export type Locale = 'ar' | 'en';

export const copy = {
  ar: {
    lang: 'ar', direction: 'rtl', languageButton: 'English', themeLight: 'فاتح', themeDark: 'داكن',
    title: 'منصة الهوية المهنية السعودية', slogan: 'ظهور رقمي متكامل يليق بك',
    searchLabel: 'ابحث عن حضور مهني', searchPlaceholder: 'الاسم أو المجال المهني', searchButton: 'ابحث',
    advanced: 'بحث متقدم', create: 'أنشئ موقعي الخاص', features: 'مزايا المنصة', updates: 'جديد المنصة',
    about: 'من نحن', privacy: 'سياسة الخصوصية', terms: 'شروط الاستخدام',
    stageNotice: 'التسجيل والبحث سيُفعّلان بعد تجهيز الخدمات المرتبطة بهما. لا تُنشأ حسابات أو نتائج تجريبية في هذه النسخة.',
    footer: '© 2026 مكتب جواهر الوطن — جميع الحقوق محفوظة',
    searchEmpty: 'لا توجد نتائج فعلية موصولة في هذه النسخة بعد.',
    featureIntro: 'هوية مهنية رقمية تليق بك',
    featureItems: ['موقع مهني مستقل ومسار قصير', 'غلاف وشعار قابلان للتخصيص', 'رمز QR للموقع وvCard', 'تنزيل بروفايل مهني PDF', 'سيرة ذاتية PDF نصية مناسبة لأنظمة ATS', 'بطاقة مهنية عمودية بنسبة 9:16', 'معرض أعمال ووسائط مهنية', 'فرص وبرامج وخطوات خبرة مع تواصل مباشر', 'خصوصية وتحكم بظهور البيانات'],
    updatesIntro: 'مساحة منظمة للفرص والمعرفة المهنية',
    categories: ['البرامج التدريبية', 'فرص العمل', 'خطوة خبرة', 'المدونة']
  },
  en: {
    lang: 'en', direction: 'ltr', languageButton: 'العربية', themeLight: 'Light', themeDark: 'Dark',
    title: 'Saudi Professional Identity Platform', slogan: 'A complete digital presence that reflects your worth',
    searchLabel: 'Search professional profiles', searchPlaceholder: 'Name or professional field', searchButton: 'Search',
    advanced: 'Advanced search', create: 'Create my professional site', features: 'Platform features', updates: 'What’s new',
    about: 'About', privacy: 'Privacy policy', terms: 'Terms of use',
    stageNotice: 'Registration and search will be enabled after their connected services are ready. This staging version creates no accounts or sample results.',
    footer: '© 2026 Jawahir Alwatan Office — All rights reserved',
    searchEmpty: 'No live search results are connected in this version yet.',
    featureIntro: 'A digital professional identity worthy of you',
    featureItems: ['An independent professional site with a short path', 'Customizable cover and logo', 'QR code for your site and vCard', 'A polished professional profile PDF', 'A text-based résumé PDF designed for ATS readability', 'A 9:16 professional card for events', 'A portfolio for professional media and work', 'Opportunities, programs and experience steps with direct contact', 'Privacy controls for what you choose to share'],
    updatesIntro: 'A clear space for opportunities and professional knowledge',
    categories: ['Training programs', 'Job opportunities', 'Experience steps', 'Insights']
  }
} as const;
