import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import fr from './locales/fr.json'
import en from './locales/en.json'

export type SupportedLocale = 'fr' | 'en'

const SUPPORTED: readonly SupportedLocale[] = ['fr', 'en']

export const detectSystemLocale = (): SupportedLocale => {
  const languageCode = getLocales()[0]?.languageCode ?? 'fr'
  return SUPPORTED.includes(languageCode as SupportedLocale)
    ? (languageCode as SupportedLocale)
    : 'fr'
}

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: detectSystemLocale(),
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
    returnObjects: true,
  })

export default i18n
