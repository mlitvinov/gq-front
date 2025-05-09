import React from "react";
import { MessageSquare } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="flex flex-col items-center max-w-5xl mx-auto bg-gradient-to-r from-quest-primary to-quest-secondary rounded-3xl p-8 md:p-12 text-gray-800 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Готовы начать?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Присоединяйся к пользователям, которые уже бросают вызовы, получают достижения, и весело проводят время с GetQuest в Telegram.</p>
        <a className="flex items-center justify-center px-4 py-2 rounded-lg bg-white hover:bg-quest-light hover:text-quest-secondary border-gray-300" href="http://cryptometaquestbot.t.me" target="_blank" rel="noopener noreferrer">
          <MessageSquare className="mr-2 h-5 w-5" />
          Открыть в Telegram
        </a>
      </div>
    </section>
  );
};

export default CTA;
