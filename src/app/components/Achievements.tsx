
import React from "react";

const achievementEmojis = [
  { "emoji": "🏆", "label": "Спортсмен" },
  { "emoji": "🚀", "label": "Исследователь" },
  { "emoji": "🧠", "label": "Светлый ум" },
  { "emoji": "🏃", "label": "Бегун" },
  { "emoji": "🎮", "label": "Геймер" },
  { "emoji": "🎨", "label": "Дизайнер" },
  { "emoji": "📚", "label": "Библиотекарь" },
  { "emoji": "🍳", "label": "Повар" }
];

const Achievements = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-quest-light/20 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Собери <span className="gradient-text">уникальные</span> достижения
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ИИ подбирает специальные значки за каждое выполненное испытание.
            Похвастайся своей коллекцией друзьям!
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-4xl mx-auto">
          {achievementEmojis.map((achievement, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center"
            >
              <div 
                className="emoji-container mb-2 animate-pulse" 
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <span className="text-3xl">{achievement.emoji}</span>
              </div>
              <p className="text-sm font-medium">{achievement.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
