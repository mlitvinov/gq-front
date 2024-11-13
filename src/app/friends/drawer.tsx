"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import { BASE_URL } from "@/lib/const";

type Achievement = {
  userAchievement: number | null;
  name: string;
  imageUrl: string;
};

type SubmitQuestDrawerProps = {
  username: string;
  initDataRaw?: string;
  receiverId: string;
  onClose?: () => void; // Пропс для закрытия окна
};

export function SubmitQuestDrawer({
  username,
  initDataRaw,
  receiverId,
  onClose,
}: SubmitQuestDrawerProps) {
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] =
    React.useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [task, setTask] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [numericValue, setNumericValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchAchievements = async () => {
      if (!initDataRaw) return;

      const response = await fetch(`${BASE_URL}/api/achievements`, {
        headers: {
          "Content-Type": "application/json",
          initData: initDataRaw,
        },
      });

      const data: Achievement[] = await response.json();
      setAchievements(data);

      if (data.length > 0) {
        setSelectedAchievement(data[0]);
        setImageUrl(`${BASE_URL}/api/images/${data[0].imageUrl}`);
      }
    };

    fetchAchievements();
  }, [initDataRaw]);

  const handleSubmit = async () => {
    if (!initDataRaw) return;

    if (!selectedAchievement || !task || !numericValue) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      return;
    }

    setIsLoading(true);

    const payload = {
      achievementId: selectedAchievement.userAchievement || 0,
      description: task,
      receiverId,
      price: parseInt(numericValue, 10),
    };

    const response = await fetch(`${BASE_URL}/api/challenges`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        initData: initDataRaw,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setIsLoading(false);
      setIsOpen(false); // Локальное закрытие окна
      onClose?.(); // Закрытие окна через родительский компонент
      alert("Задание успешно отправлено!");
    } else {
      const message =
        response.status === 400
          ? "У вас недостаточно репутации для создания этого испытания."
          : "Ошибка на сервере. Попробуйте позже.";
      setErrorMessage(message);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        style={{ backgroundColor: "#FEEF9E", color: "black" }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        Квест
      </Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col">
          <header className="px-4">
            <label className="block text-sm text-center font-medium text-black mb-2">
              Испытание для {username}
            </label>
          </header>

          <section className="mb-2 px-4">
            <div className="px-5 py-3 border border-[#F6F6F6] rounded-[32px]">
              <label className="block text-xs font-light text-black/50">
                Категория
              </label>

              <select
                title=""
                name="category"
                value={selectedAchievement?.name || ""}
                onChange={(e) => {
                  const selected = achievements.find(
                    (ach) => ach.name === e.target.value
                  );
                  if (selected) {
                    setSelectedAchievement(selected);
                    setImageUrl(`${BASE_URL}/api/images/${selected.imageUrl}`);
                  }
                }}
                className="border-none bg-transparent appearance-none focus:outline-none w-full"
              >
                {achievements.map((achievement) => (
                  <option key={achievement.name} value={achievement.name}>
                    {achievement.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="mb-2 px-4">
            <div className="px-5 py-3 border border-[#F6F6F6] rounded-[32px]">
              <label className="block text-xs font-light text-black/50">
                Задание
              </label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="size-full focus:outline-none"
              />
            </div>
          </section>

          {imageUrl && (
            <div className="flex justify-center my-2 px-4">
              <img
                src={imageUrl}
                alt="Achievement"
                className="h-32 object-contain"
              />
            </div>
          )}

          <div className="mb-4 px-4">
            <input
              type="text"
              value={numericValue}
              onChange={(e) =>
                setNumericValue(e.target.value.replace(/\D/g, ""))
              }
              className="w-full text-3xl font-black focus:outline-none text-center text-gradient placeholder:text-black/10 p-2"
              placeholder="0"
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}

          <footer className="flex flex-col gap-2 px-4">
            <Button
              isLoading={isLoading}
              onClick={handleSubmit}
              variant="secondary"
              className="w-full z-[9999]"
            >
              Отправить
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full"
            >
              Отмена
            </Button>
          </footer>
        </div>
      </Drawer>
    </>
  );
}
