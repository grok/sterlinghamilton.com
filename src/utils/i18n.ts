export type LocaleCode = 'en' | 'es';

export type UiLabels = {
  /** Home wordmark title */
  homeTitle: string;
  index: string;
  top: string;
  noPostsYet: string;
  backToTop: string;

  // 404
  notFoundTitle: string;
  notFoundMessage: string;
  backToHome: string;

  // Header / controls
  contact: string;
  alreadyOnContactPage: string;
  chooseLanguage: string;
  noTranslationsAvailable: string;
  switchToLightMode: string;
  switchToDarkMode: string;

  // Copy + toasts
  copyLink: string;
  copiedLink: string;
  copiedCode: string;

  // Mermaid
  viewDiagramFullScreen: string;
  viewFullScreen: string;
  closeDiagram: string;
  close: string;

  // Contact page
  resume: string;
};

export function normalizeLocale(input?: string): LocaleCode {
  const v = (input || '').toLowerCase();
  if (v.startsWith('es')) return 'es';
  return 'en';
}

export function localeFromPathname(pathname: string): LocaleCode {
  const first = pathname.split('/').filter(Boolean)[0];
  return normalizeLocale(first);
}

export function getUiLabels(locale: string): UiLabels {
  const l = normalizeLocale(locale);
  if (l === 'es') {
    return {
      homeTitle: '¡Hola, soy Sterling!',
      index: 'índice',
      top: 'Arriba',
      noPostsYet: 'Todavía no he publicado contenido en este idioma. ¡Pronto™!',
      backToTop: 'Volver arriba',

      notFoundTitle: '404: que sorpresa.',
      notFoundMessage: 'Oye. Buscas algo que no existe aqui.',
      backToHome: 'Volver al inicio',

      contact: 'Contacto',
      alreadyOnContactPage: 'Ya estás en la página de contacto',
      chooseLanguage: 'Elegir idioma',
      noTranslationsAvailable: 'No hay traducciones disponibles',
      switchToLightMode: 'Cambiar a modo claro',
      switchToDarkMode: 'Cambiar a modo oscuro',

      copyLink: 'Copiar enlace',
      copiedLink: 'Enlace copiado.',
      copiedCode: 'Código copiado.',

      viewDiagramFullScreen: 'Ver diagrama en pantalla completa',
      viewFullScreen: 'Ver pantalla completa',
      closeDiagram: 'Cerrar diagrama',
      close: 'Cerrar',

      resume: 'Curriculum',
    };
  }
  return {
    homeTitle: "Hello, I'm Sterling!",
    index: 'index',
    top: 'Top',
    noPostsYet: "I haven't published content in this language yet! Soon™.",
    backToTop: 'Back to top',

    notFoundTitle: '404: well, this is awkward.',
    notFoundMessage: "Yo. You're looking for something that ain't here.",
    backToHome: 'Back to home',

    contact: 'Contact',
    alreadyOnContactPage: "You're already on the contact page",
    chooseLanguage: 'Choose language',
    noTranslationsAvailable: 'No translations available',
    switchToLightMode: 'Switch to light mode',
    switchToDarkMode: 'Switch to dark mode',

    copyLink: 'Copy link',
    copiedLink: 'Copied link.',
    copiedCode: 'Copied code.',

    viewDiagramFullScreen: 'View diagram full screen',
    viewFullScreen: 'View full screen',
    closeDiagram: 'Close diagram',
    close: 'Close',

    resume: 'Resume',
  };
}
