export const defaultLocale = "ru";

export const timeZone = "Europe/Moscow";

export const locales = [defaultLocale, "en"] as const;

export const localesMap = [
  { key: "en", title: "English" },
  { key: "ru", title: "Русский" },
];
