"use client";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const STORAGE_NAME = "IS_FIRST_LAUNCH";

const getFirstLaunch = () => {
  return localStorage.getItem(STORAGE_NAME) ?? null;
};

const setFirstLaunch = (state?: "YES") => {
  if (state === "YES") {
    localStorage.setItem(STORAGE_NAME, state);
  } else {
    localStorage.removeItem(STORAGE_NAME);
  }
};

export { getFirstLaunch, setFirstLaunch };
