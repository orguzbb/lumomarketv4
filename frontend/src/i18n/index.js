import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
  uz: {
    translation: {
      welcome: "Xush kelibsiz",
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
      home: "Bosh sahifa",
    },
  },
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      register: "Register",
      home: "Home",
    },
  },
  ru: {
    translation: {
      welcome: "Добро пожаловать",
      login: "Войти",
      register: "Регистрация",
      home: "Главная",
    },
  },
};
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("lang") || "uz",
    fallbackLng: "uz",
    interpolation: { escapeValue: false },
  });
export default i18n;
