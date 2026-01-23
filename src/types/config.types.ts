// Date format types
export type DateFormat =
  | 'YYYY-MM-DD'
  | 'MM-DD-YYYY'
  | 'DD-MM-YYYY'
  | 'MONTH DAY YYYY'
  | 'DAY MONTH YYYY';

// Site info configuration type
export interface SiteInfo {
  website: string;
  /** Stable site name used for <title>, RSS, etc. */
  name: string;
  /** Header wordmark text (can be more “content-y” like a greeting). */
  headerTitle: string;
  author: string;
  description: string;
  language: string;
  /** Default locale used for URL routing, e.g. "en". */
  defaultLocale: string;
  /** Locales available in the language picker. */
  locales: Array<{
    code: string;
    label: string;
    /** BCP-47 tag used for <html lang="..."> (e.g. "en-US"). */
    langTag: string;
  }>;
}

// General settings configuration type
export interface GeneralSettings {
  contentWidth: string;
  centeredLayout: boolean;
  themeToggle: boolean;
  postListDottedDivider: boolean;
  footer: boolean;
  fadeAnimation: boolean;
}

// Date settings configuration type
export interface DateSettings {
  dateFormat: DateFormat;
  dateSeparator: string;
  dateOnRight: boolean;
}

// Post settings configuration type
export interface PostSettings {
  readingTime: boolean;
  toc: boolean;
  imageViewer: boolean;
  copyCode: boolean;
  linkCard: boolean;
}

// Theme configuration type
export interface ThemeConfig {
  site: SiteInfo;
  general: GeneralSettings;
  date: DateSettings;
  post: PostSettings;
}
