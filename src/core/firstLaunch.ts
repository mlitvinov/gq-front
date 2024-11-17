"use client";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = "IS_FIRST_LAUNCH";

const getFirstLaunch = async () => {
  return localStorage.getItem(COOKIE_NAME) ?? null;
};

const setFirstLaunch = async (state?: "YES") => {
  if (state === "YES") {
    localStorage.setItem(COOKIE_NAME, state);
  } else {
    localStorage.removeItem(COOKIE_NAME);
  }
};

export { getFirstLaunch, setFirstLaunch };
