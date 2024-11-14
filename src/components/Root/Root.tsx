"use client";

import { type PropsWithChildren, useEffect } from "react";
import { initData, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorPage } from "@/components/ErrorPage";
import { useTelegramMock } from "@/hooks/useTelegramMock";
import { useDidMount } from "@/hooks/useDidMount";
import { useClientOnce } from "@/hooks/useClientOnce";
import { setLocale } from "@/core/i18n/locale";
import { init } from "@/core/init";

import Navigation from "../Navigation";

function RootInner({ children }: PropsWithChildren) {
  const isDev = process.env.NODE_ENV === "development";

  // Mock Telegram environment in development mode if needed.
  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  /*   useEffect(() => {
    if (window) {
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", () => {
          document.body.style.height = window.visualViewport!.height + "px";
        });
      }
      // This will ensure user never overscroll the page
      window.addEventListener("scroll", () => {
        if (window.scrollY > 0) window.scrollTo(0, 0);
      });
    }
  }, []); */

  const lp = useLaunchParams();
  const debug = isDev || lp.startParam === "debug";

  // Initialize the library.
  useClientOnce(() => {
    init(debug);
  });

  // const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);

  // Set the user locale.
  useEffect(() => {
    initDataUser && setLocale(initDataUser.languageCode);
  }, [initDataUser]);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    debug && import("eruda").then((lib) => lib.default.init());
  }, [debug]);

  return (
    <AppRoot className="overflow-x-hidden overflow-y-hidden h-screen select-none p-0" appearance={/* isDark ? "dark" :  */ "light"} platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}>
      <main className="h-full overflow-y-auto pb-[--nav-height]">
        {children}
        <Navigation />
      </main>
    </AppRoot>
  );
}

/* const Gradient = () => {
  // Массив для генерации нескольких квадратов
  const squares = [
    {
      id: 1,
      position: "transform -translate-x-1/2 -translate-y-1/2",
      gradient: "bg-gradient-to-tr from-red-400 via-pink-500 to-red-500",
      animation: "animate-gradient-morph1",
    },
    {
      id: 2,
      position: "transform -translate-x-1/2 translate-y-1/2",
      gradient: "bg-gradient-to-tl from-purple-400 via-green-500 to-yellow-500",
      animation: "animate-gradient-morph2",
    },
    {
      id: 3,
      position: "transform -translate-x-1/2 -translate-y-1/2",
      gradient: "bg-gradient-to-br from-indigo-400 via-blue-500 to-purple-500",
      animation: "animate-gradient-morph1",
    },
    {
      id: 4,
      position: "transform translate-x-1/2 -translate-y-1/2",
      gradient: "bg-gradient-to-bl from-green-400 via-teal-500 to-blue-500",
      animation: "animate-gradient-morph2",
    },
  ];

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden">
      {squares.map((square) => (
        <div key={square.id} className={`absolute ${square.position} top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-32 h-32 rounded-md opacity-80 ${square.gradient} ${square.animation} blur-3xl`}></div>
      ))}
    </div>
  );
};
 */
export function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div />
  );
}
