import type { PropsWithChildren } from "react";
import type { Metadata } from "next";

import { Root } from "@/components/Root/Root";

import "@telegram-apps/telegram-ui/dist/styles.css";
// import "modern-normalize/modern-normalize.css";
import "./_assets/globals.css";
import { cn } from "@/lib/utils";
import { fontInter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Your Application Title Goes Here",
  description: "Your application description goes here",
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
        <Root>{children}</Root>
      </body>
    </html>
  );
}
