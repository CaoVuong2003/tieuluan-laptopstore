import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN from '../locales/en/en.json';
import VI from '../locales/vi/vi.json';

export const locales = {
    en: 'English',
    vi: 'Tiếng Việt'
}

export const resources = {
    en: { translation: EN },
    vi: { translation: VI }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'vi',
        fallbackLng: 'vi',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;