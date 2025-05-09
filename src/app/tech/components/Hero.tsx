import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="py-12 md:py-24 px-4 md:px-8 flex flex-col items-center text-center">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="emoji-container bg-quest-light animate-float">
            <span className="text-4xl">🏆</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
          Бросай вызов друзьям, <span className="gradient-text">получай достижения</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">Социальная сеть, в которой выполненные задания приносят достижения и внутренний рейтинг</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a className={cn("flex justify-center items-center px-4 py-2 rounded-lg text-lg bg-quest-primary hover:bg-quest-secondary")} href="http://cryptometaquestbot.t.me" target="_blank" rel="noopener noreferrer">
            Начать челлендж <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
