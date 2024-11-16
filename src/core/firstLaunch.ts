//use server is required
"use server";

import { cookies } from "next/headers";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = "IS_FIRST_LAUNCH";

const getFirstLaunch = async () => {
  return cookies().get(COOKIE_NAME)?.value ?? null;
};

const setFirstLaunch = async (state?: "YES") => {
  cookies().set(COOKIE_NAME, (state as "YES") ?? null);
};

export { getFirstLaunch, setFirstLaunch };
