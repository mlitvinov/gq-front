"use client";

import { useEffect } from "react";

export default function YandexMetrika() {
  useEffect(() => {
    (function(
      m: any,
      e: Document,
      t: string,
      r: string,
      i: string,
      k?: HTMLScriptElement,
      a?: HTMLElement
    ) {
      m[i] =
        m[i] ||
        function() {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = Date.now();
      for (let j = 0; j < e.scripts.length; j++) {
        if (e.scripts[j].src === r) {
          return;
        }
      }
      k = e.createElement(t) as HTMLScriptElement;
      a = e.getElementsByTagName("head")[0] || e.documentElement;
      k.async = true;
      k.src = r;
      if (a && a.parentNode) {
        a.parentNode.insertBefore(k, a);
      }
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    // @ts-ignore:
    ym(98879703, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
  }, []);

  return (
    <noscript>
      <div>
        <img
          src="https://mc.yandex.ru/watch/98879703"
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </div>
    </noscript>
  );
}
