export type LocaleCode = 'en' | 'es';

export type UiLabels = {
  /** Home wordmark title */
  homeTitle: string;
  index: string;
  top: string;
  noPostsYet: string;
  backToTop: string;

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
    };
  }
  return {
    homeTitle: "Hello, I'm Sterling!",
    index: 'index',
    top: 'Top',
    noPostsYet: "I haven't published content in this language yet! Soon™.",
    backToTop: 'Back to top',

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
  };
}
