import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Award, Users, Star } from "lucide-react";

const featuresData = [
  {
    title: "Бросай вызов",
    description: "Отправляй друзьям увлекательные испытания в Telegram.",
    icon: <MessageSquare className="h-12 w-12 text-quest-primary" />,
  },
  {
    title: "Зарабатывай очки",
    description: "Выполняй задания и получай очки, повышающие твой рейтинг.",
    icon: <Star className="h-12 w-12 text-quest-primary" />,
  },
  {
    title: "Уникальные достижения",
    description: "Получай уникальные значки, за каждое выполненное испытание.",
    icon: <Award className="h-12 w-12 text-quest-primary" />,
  },
  {
    title: "Глобальная лента",
    description: "Смотри интересные задания в глобальной ленте рекомендаций.",
    icon: <Users className="h-12 w-12 text-quest-primary" />,
  },
];

const Features = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-quest-light/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Как <span className="gradient-text">GetQuest</span> работает
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Наш мини‑приложение в Telegram делает вызовы друзьям простыми и увлекательными.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature, index) => (
            <Card key={index} className="quest-card border-quest-primary/10 hover:border-quest-primary/30">
              <CardHeader className="pb-2 pt-6">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
