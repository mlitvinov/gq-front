import { Suspense, type PropsWithChildren } from "react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { cn } from "@/lib/utils";
import { fontInter } from "@/lib/fonts";

import YandexMetrika from "@/components/YandexMetrika";
import { I18nProvider } from "@/core/i18n/provider";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "normalize.css/normalize.css";
import "./_assets/globals.css";

export const metadata: Metadata = {
  title: "GetQuest",
  description: "For challenge lovers",
};

export const viewport = {
  width: "device-width, shrink-to-fit=no",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
  shrinkToFit: "no",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={cn("bg-background min-h-screen font-inter antialiased", fontInter.className)}>
        <I18nProvider>
          {children}
          {process.env.NODE_ENV === "production" && (
            <Suspense>
              <YandexMetrika />
            </Suspense>
          )}
        </I18nProvider>
      </body>
    </html>
  );
}
