"use client";

import { useLocale } from "next-intl";
import { FC } from "react";

import { setLocale } from "@/core/i18n/locale";
import { Locale } from "@/core/i18n/types";
import { Button } from "../ui/button";

export const LocaleSwitcher: FC = () => {
  const locale = useLocale();

  const onChange = (value: string) => {
    const locale = value as Locale;
    setLocale(locale);
    localStorage.setItem("force_locale", locale);
  };

  return (
    <div className="relative inline-block custom-locale-switcher">
      <Button variant="outline" value={locale} onClick={() => onChange((locale as Locale) === "ru" ? "en" : "ru")} className="size-12 uppercase text-gray-500">
        {locale}
      </Button>
    </div>
  );
};
