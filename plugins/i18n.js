import {defineNuxtPlugin} from "#app";
import { createI18n } from "vue-i18n";

const ru = {
    bannerTitle: "Центры и кружки в одном месте",
    bannerSubtitle: "Лучшие места и занятия для развития ваших детей",
}

const kz = {
    bannerTitle: "Орталықтар мен шеңберлер бір жерде",
    bannerSubtitle: "Өзіңізді дамыту үшін ең жақсы орындар мен әрекеттер балалар",
}

export default defineNuxtPlugin(nuxtApp => {
    console.log(nuxtApp)
    const i18n = createI18n({
        locale: "ru",
        fallbackLocale: "ru",
        messages: {ru, kz},
        detectBrowserLanguage: {
            alwaysRedirect: true
        },
    })

    console.log("client", process.client)

    nuxtApp.vueApp.use(i18n);
    nuxtApp.provide("i18n", i18n.global);
})