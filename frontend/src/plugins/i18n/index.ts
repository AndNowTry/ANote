import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from "./languages/en.ts"
import { ru } from "./languages/ru.ts"



i18n
.use(initReactI18next)
.init({
    resources: {
        ru,
        en,
    },
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
})

export default i18n