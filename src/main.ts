import './style.css';
import { copy, type Locale } from './copy';

type View = 'home' | 'features' | 'updates' | 'about' | 'privacy' | 'terms' | 'register' | 'login' | 'recovery';
const state = {
  locale: (localStorage.getItem('saudicv-locale') === 'en' ? 'en' : 'ar') as Locale,
  theme: (localStorage.getItem('saudicv-theme') === 'dark' ? 'dark' : 'light') as 'light' | 'dark',
  view: 'home' as View
};
const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('Application root is missing');

function brandLogo(): string {
  const language = state.locale === 'ar' ? 'ar' : 'en';
  return `logo-${language}${state.theme === 'dark' ? '-dark' : ''}.webp`;
}

function safeText(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);
}

function navigate(view: View): void {
  state.view = view;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render(): void {
  const t = copy[state.locale];
  document.documentElement.lang = t.lang;
  document.documentElement.dir = t.direction;
  document.documentElement.dataset.theme = state.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.theme === 'dark' ? '#142A1B' : '#ffffff');
  document.title = `${state.view === 'home' ? t.title : pageTitle(t, state.view)} | Saudi CV`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t.description);
  const logo = brandLogo();
  const themeAction = state.theme === 'light' ? t.themeDark : t.themeLight;
  const page = state.view === 'home' ? homePage(t) : contentPage(t, state.view);

  root!.innerHTML = `
    <div class="site-shell">
      <header class="topbar" aria-label="${safeText(state.locale === 'ar' ? 'أدوات العرض' : 'Display controls')}">
        <a class="mini-brand" href="/" data-view="home" aria-label="Saudi CV home">
          <img src="/assets/${logo}" alt="Saudi CV" width="52" height="52" />
        </a>
        <div class="controls">
          <button class="control" type="button" id="theme-toggle" aria-label="${safeText(themeAction)}">${state.theme === 'light' ? '◐' : '☼'} <span>${safeText(themeAction)}</span></button>
          <button class="control language" type="button" id="language-toggle" aria-label="${safeText(t.languageButton)}">${safeText(t.languageButton)}</button>
        </div>
      </header>
      <main id="main-content">${page}</main>
      <footer class="footer">
        <a href="/" data-view="home" class="footer-brand"><img src="/assets/${logo}" alt="Saudi CV" loading="lazy" /></a>
        <nav aria-label="${safeText(state.locale === 'ar' ? 'روابط قانونية' : 'Legal links')}">
          <a href="/about" data-view="about">${safeText(t.about)}</a>
          <a href="/privacy" data-view="privacy">${safeText(t.privacy)}</a>
          <a href="/terms" data-view="terms">${safeText(t.terms)}</a>
        </nav>
        <p>${safeText(t.footer)}</p>
      </footer>
    </div>`;

  document.querySelector('#theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('saudicv-theme', state.theme);
    render();
  });
  document.querySelector('#language-toggle')?.addEventListener('click', () => {
    state.locale = state.locale === 'ar' ? 'en' : 'ar';
    localStorage.setItem('saudicv-locale', state.locale);
    render();
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-view]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    const view = link.dataset.view as View | undefined;
    if (view) navigate(view);
  }));
  document.querySelector('#create-site')?.addEventListener('click', () => navigate('register'));
  document.querySelector('#search-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const result = document.querySelector<HTMLParagraphElement>('#search-result');
    if (result) { result.textContent = t.searchEmpty; result.hidden = false; }
  });
  document.querySelector('#advanced-search')?.addEventListener('click', () => showNotice(t.stageNotice));
}

function pageTitle(t: typeof copy[Locale], view: View): string {
  const names: Record<View, string> = {
    home: t.title, features: t.features, updates: t.updates, about: t.about, privacy: t.privacy, terms: t.terms,
    register: t.registerTitle, login: t.loginTitle, recovery: t.recoveryTitle
  };
  return names[view];
}

function homePage(t: typeof copy[Locale]): string {
  return `
    <section class="hero" aria-labelledby="brand-title">
      <div class="hero-mark"><img class="hero-logo" src="/assets/${brandLogo()}" alt="Saudi CV" width="430" height="430" fetchpriority="high" /></div>
      <h1 id="brand-title">${safeText(t.title)}</h1>
      <p class="slogan">${safeText(t.slogan)}</p>
    </section>
    <section class="search-card" aria-label="${safeText(t.searchLabel)}">
      <form id="search-form" role="search">
        <label for="search-query">${safeText(t.searchLabel)}</label>
        <div class="search-row">
          <input id="search-query" type="search" autocomplete="off" placeholder="${safeText(t.searchPlaceholder)}" />
          <button type="submit" class="primary compact">${safeText(t.searchButton)}</button>
        </div>
      </form>
      <p id="search-result" class="inline-status" role="status" hidden></p>
      <button type="button" id="advanced-search" class="text-action">${safeText(t.advanced)}</button>
    </section>
    <section class="primary-actions" aria-label="${safeText(t.title)}">
      <button id="create-site" class="primary">${safeText(t.create)}</button>
      <a class="primary" href="/features" data-view="features">${safeText(t.features)}</a>
      <a class="primary" href="/updates" data-view="updates">${safeText(t.updates)}</a>
    </section>
    <p class="stage-notice" role="note">${safeText(t.stageNotice)}</p>`;
}

function contentPage(t: typeof copy[Locale], view: View): string {
  if (view === 'features') return `<section class="content-page"><p class="eyebrow">Saudi CV</p><h1>${safeText(t.featureIntro)}</h1><div class="feature-list">${t.featureItems.map((item, i) => `<article class="feature-item"><span class="number">${i + 1}</span><h2>${safeText(item)}</h2></article>`).join('')}</div><p class="stage-notice">${safeText(t.stageNotice)}</p><button class="primary" id="create-site">${safeText(t.create)}</button></section>`;
  if (view === 'updates') return `<section class="content-page"><p class="eyebrow">Saudi CV</p><h1>${safeText(t.updates)}</h1><p class="lead">${safeText(t.updatesIntro)}</p><div class="category-list">${t.categories.map((item, i) => `<article class="category-card"><span class="number">0${i + 1}</span><h2>${safeText(item)}</h2><p>${safeText(t.stageNotice)}</p></article>`).join('')}</div></section>`;
  if (view === 'register') return registerPage(t);
  if (view === 'login') return loginPage(t);
  if (view === 'recovery') return recoveryPage(t);

  const title = pageTitle(t, view);
  const body = state.locale === 'ar'
    ? 'هذه الصفحة قيد الإعداد. لن ننشر محتوى قانونياً نهائياً أو بيانات تعريفية غير معتمدة.'
    : 'This page is being prepared. Final legal text and unapproved operator details are not published here.';
  return `<section class="content-page"><p class="eyebrow">Saudi CV</p><h1>${safeText(title)}</h1><p class="lead">${safeText(body)}</p></section>`;
}

function previewBanner(t: typeof copy[Locale]): string {
  return `<div class="preview-banner" role="note"><strong>${safeText(t.accountPreviewTitle)}</strong><p>${safeText(t.accountPreviewNotice)}</p></div>`;
}

function field(id: string, label: string, placeholder: string, type = 'text', help = ''): string {
  const describedBy = help ? `aria-describedby="${id}-help"` : '';
  return `<div class="form-field"><label for="${id}">${safeText(label)}</label><input id="${id}" type="${type}" placeholder="${safeText(placeholder)}" disabled ${describedBy} autocomplete="off" />${help ? `<small id="${id}-help">${safeText(help)}</small>` : ''}</div>`;
}

function registerPage(t: typeof copy[Locale]): string {
  const roleOptions = t.roles.map(role => `<option>${safeText(role)}</option>`).join('');
  return `<section class="content-page account-page"><p class="eyebrow">Saudi CV</p><h1>${safeText(t.registerTitle)}</h1>${previewBanner(t)}
    <form class="registration-form" aria-label="${safeText(t.registerTitle)}" autocomplete="off">
      <div class="form-field"><label for="register-role">${safeText(t.roleLabel)}</label><select id="register-role" disabled>${roleOptions}</select></div>
      ${field('register-name', t.nameRequired, t.namePlaceholder)}
      ${field('register-path', t.pathRequired, t.pathPlaceholder, 'text', t.pathHelp)}
      ${field('register-email', t.emailRequired, t.emailPlaceholder, 'email')}
      ${field('register-whatsapp', t.whatsappRequired, t.whatsappPlaceholder, 'tel', t.whatsappHelp)}
      ${field('register-phone', t.phoneOptional, t.phonePlaceholder, 'tel', t.phoneHelp)}
      ${field('register-specialty', t.specialtyOptional, t.specialtyPlaceholder, 'text', t.specialtyHelp)}
      ${field('register-password', t.passwordRequired, t.passwordPlaceholder, 'password')}
      ${field('register-password-confirm', t.passwordConfirmRequired, t.passwordPlaceholder, 'password')}
      <label class="check-row"><input type="checkbox" disabled /> <span>${safeText(t.ageConsent)}</span></label>
      <label class="check-row"><input type="checkbox" disabled /> <span>${safeText(t.termsConsent)}</span></label>
      <button class="primary submit-disabled" type="button" disabled>${safeText(t.registerSubmit)}</button>
    </form>
    <p class="account-switch">${safeText(t.haveAccount)} <a href="/login" data-view="login">${safeText(t.loginTitle)}</a></p>
  </section>`;
}

function loginPage(t: typeof copy[Locale]): string {
  return `<section class="content-page account-page"><p class="eyebrow">Saudi CV</p><h1>${safeText(t.loginTitle)}</h1>${previewBanner(t)}
    <form class="registration-form" aria-label="${safeText(t.loginTitle)}" autocomplete="off">
      ${field('login-email', t.emailRequired, t.emailPlaceholder, 'email')}
      ${field('login-password', t.passwordRequired, t.passwordPlaceholder, 'password')}
      <button class="primary submit-disabled" type="button" disabled>${safeText(t.loginSubmit)}</button>
    </form>
    <p class="account-switch"><a href="/recovery" data-view="recovery">${safeText(t.recoveryTitle)}</a></p>
    <p class="account-switch">${safeText(t.noAccount)} <a href="/register" data-view="register">${safeText(t.registerTitle)}</a></p>
  </section>`;
}

function recoveryPage(t: typeof copy[Locale]): string {
  return `<section class="content-page account-page"><p class="eyebrow">Saudi CV</p><h1>${safeText(t.recoveryTitle)}</h1>${previewBanner(t)}
    <form class="registration-form" aria-label="${safeText(t.recoveryTitle)}" autocomplete="off">
      ${field('recovery-email', t.emailRequired, t.emailPlaceholder, 'email')}
      <button class="primary submit-disabled" type="button" disabled>${safeText(t.recoverySubmit)}</button>
    </form>
    <p class="account-switch"><a href="/login" data-view="login">${safeText(t.backToLogin)}</a></p>
  </section>`;
}

function showNotice(message: string): void {
  const note = document.querySelector<HTMLParagraphElement>('.stage-notice');
  if (note) { note.textContent = message; note.focus(); }
}

render();
