import { i18n } from "@lingui/core";
import { en, es } from "make-plural/plurals";

i18n.loadLocaleData({
  en: { plurals: en },
  es: { plurals: es },
});

/**
 * Load messages for requested locale and activate it.
 * This function isn't part of the LinguiJS library because there are
 * many ways how to load messages — from REST API, from file, from cache, etc.
 */
export async function activateLocale(locale: string) {
  const { messages } = await import(`./locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

// Initialize with English as default
activateLocale("en");

export { i18n };
