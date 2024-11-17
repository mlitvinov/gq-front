//use server is required
"use client";

import { defaultLocale } from "./config";
import type { Locale } from "./types";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const STORAGE_KEY = "GET_QUEST_LOCALE";

const getLocale = () => {
  return localStorage.getItem(STORAGE_KEY) || defaultLocale;
};

const setLocale = (locale?: string) => {
  localStorage.setItem(STORAGE_KEY, (locale as Locale) || defaultLocale);
};

export { getLocale, setLocale };
