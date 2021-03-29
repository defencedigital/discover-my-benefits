/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import frLocaleData from 'react-intl/locale-data/fr';
import deLocaleData from 'react-intl/locale-data/de';
import esLocaleData from 'react-intl/locale-data/es';

import { DEFAULT_LOCALE } from './containers/App/constants'; // eslint-disable-line
import armyTranslationMessages from './translations/army.json';
import navyTranslationMessages from './translations/navy.json';
import rafTranslationMessages from './translations/raf.json';
import marinesTranslationMessages from './translations/marines.json';

export const appLocales = ['en', 'fr', 'de', 'es'];

addLocaleData(enLocaleData);
addLocaleData(frLocaleData);
addLocaleData(deLocaleData);
addLocaleData(esLocaleData);

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== DEFAULT_LOCALE ? formatTranslationMessages(DEFAULT_LOCALE, armyTranslationMessages) : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    let message = messages[key];
    if (!message && locale !== DEFAULT_LOCALE) {
      message = defaultFormattedMessages[key];
    }
    return Object.assign(formattedMessages, { [key]: message });
  }, {});
};

export const translationMessages = {
  en: formatTranslationMessages('en', armyTranslationMessages),
  fr: formatTranslationMessages('fr', navyTranslationMessages),
  de: formatTranslationMessages('de', rafTranslationMessages),
  es: formatTranslationMessages('es', marinesTranslationMessages),
};
