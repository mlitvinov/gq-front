import React from "react";
import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { Root } from "@/components/Root/Root";
import { cn } from "@/lib/utils";
import { fontInter } from "@/lib/fonts";

import "@telegram-apps/telegram-ui/dist/styles.css";
import "./_assets/globals.css";
import YandexMetrika from "@/components/YandexMetrika";

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
          "bg-background min-h-screen font-inter antialiased",
          fontInter.className
        )}
      >
        <YandexMetrika /> {}
        <Root>{children}</Root>
      </body>
    </html>
  );
}
