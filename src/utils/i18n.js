import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import english from './english.json';
import odia from './odia.json';

i18n.use(initReactI18next).init({
  resources: {
    en: english,
    od: odia,
  },
  compatibilityJSON: 'v3',
  lng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
