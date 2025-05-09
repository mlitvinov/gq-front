import React from "react";

const steps = [
  {
    number: "01",
    title: "Подключись в Telegram",
    description: "Открой GetQuest прямо в Telegram — без лишних приложений.",
    emoji: "📱",
  },
  {
    number: "02",
    title: "Создай челлендж",
    description: "Отправь друзьям весёлое и захватывающее испытание.",
    emoji: "🎯",
  },
  {
    number: "03",
    title: "Выполни задание",
    description: "Выполни испытание и отправь доказательство, чтобы получить очки.",
    emoji: "✅",
  },
  {
    number: "04",
    title: "Собери достижения",
    description: "Получай уникальные значки, подобранные ИИ, специально для выполненного задания.",
    emoji: "🏆",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Четыре <span className="gradient-text">простых</span> шага
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Начать с GetQuest быстро и просто — вот как это работает:</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="quest-card h-full flex flex-col items-center text-center p-6">
                <div className="emoji-container mb-6 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                  <span className="text-3xl">{step.emoji}</span>
                </div>
                <div className="absolute -top-4 -left-2 bg-quest-primary text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">{step.number}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
