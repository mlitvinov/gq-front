/* app/Home.tsx  (Next 13+ app-router) */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isTMA } from '@telegram-apps/sdk-react';

import Hero            from './components/Hero';
import Features        from './components/Features';
import HowItWorks      from './components/HowItWorks';
import Achievements    from './components/Achievements';
import CTA             from './components/CTA';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // внутри useEffect нельзя делать сам хук async,
    // поэтому оборачиваем в самовызывающуюся функцию…
    (async () => {
      try {
        if (await isTMA()) {           // ☑️ дождались boolean-ответа
          router.replace('/profile');
        }
      } catch {
        /* вне Telegram isTMA отклоняется — игнорируем */
      }
    })();
  }, [router]);

  /* Отрисовываем лендинг только вне Telegram */
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="overflow-y-auto flex flex-col">
        <header className="w-full py-4 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2"></div>
        </header>
        <main className="flex-grow">
          <Hero />
          <Features />
          <HowItWorks />
          <Achievements />
          <CTA />
        </main>
        <footer className="py-8 px-4 md:px-8 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0"></div>
              <div className="text-sm items-center text-gray-500">© {new Date().getFullYear()} GetQuest. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
