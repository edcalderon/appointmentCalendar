import { i18n } from "@lingui/core";
import * as plurals from "make-plural/plurals";
import { messages as enMessages } from "./locales/en/messages";
import { messages as esMessages } from "./locales/es/messages";

i18n.loadLocaleData({
  en: { plurals: plurals.en },
  es: { plurals: plurals.es },
});

const messages = {
  en: enMessages,
  es: esMessages,
};

/**
 * Load messages for requested locale and activate it.
 * This function isn't part of the LinguiJS library because there are
 * many ways how to load messages — from REST API, from file, from cache, etc.
 */
export async function activateLocale(locale: string) {
  const localeMessages = messages[locale as keyof typeof messages];
  if (localeMessages) {
    i18n.load(locale, localeMessages);
    i18n.activate(locale);
  }
}

// Initialize with English as default
activateLocale("en");

export { i18n };
