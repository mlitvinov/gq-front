import React, { PropsWithChildren, Suspense } from "react";
import type { Metadata } from "next";

import YandexMetrika from "@/components/YandexMetrika";
import { Root } from "@/components/Root/Root";
import { cn } from "@/lib/utils";
import { fontInter } from "@/lib/fonts";

import "@telegram-apps/telegram-ui/dist/styles.css";
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
  viewportFit: "cover",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background min-h-screen font-inter antialiased scroll-lock top-auto",
          fontInter.className
        )}
        style={{ top: "auto" }}
      >
        <Root>{children}</Root>
        {process.env.NODE_ENV === "production" && (
          <Suspense>
            <YandexMetrika />
          </Suspense>
        )}
      </body>
    </html>
  );
}
