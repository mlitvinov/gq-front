"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import { api } from "@/lib/api";
import { BASE_URL } from "@/lib/const";
import { useTranslations } from "next-intl";
import { Achievement } from "@/types/entities";

type SubmitQuestDrawerProps = {
  username: string;
  receiverId: string;
  onClose?: () => void; // Пропс для закрытия окна
};

export function SubmitQuestDrawer({ username, receiverId, onClose }: SubmitQuestDrawerProps) {
  const t = useTranslations("friends");

  const selectRef = useRef<HTMLSelectElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sizerRef = useRef<HTMLDivElement | null>(null);

  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = React.useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [task, setTask] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [numericValue, setNumericValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchAchievements = async () => {
      const data = await api.get<Achievement[]>("/api/achievements");

      setAchievements(data);

      if (data.length > 0) {
        setSelectedAchievement(data[0]);
        setImageUrl(`${BASE_URL}/api/images/${data[0].imageUrl}`);
      }
    };

    fetchAchievements();
  }, []);

  const handleSubmit = async () => {
    if (!selectedAchievement || !task || !numericValue) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      return;
    }

    setIsLoading(true);

    const body = {
      achievementId: selectedAchievement.userAchievement || 0,
      description: task,
      receiverId,
      price: parseInt(numericValue, 10),
    };

    try {
      await api.post("/api/challenges", body);

      setIsLoading(false);
      setIsOpen(false); // Локальное закрытие окна
      onClose?.(); // Закрытие окна через родительский компонент
      alert(t("task-success-complete"));
    } catch (error) {
      const message = (error as any)?.status === 400 ? "У вас недостаточно репутации для создания этого испытания." : "Ошибка на сервере. Попробуйте позже.";
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  // Function to handle focus without default scrolling
  const handleFocus = (e: any) => {
    sizerRef.current!.style.height = "642px";
    e.preventDefault(); // Prevent the default focus behavior

    // Manually focus the select without scrolling
    if (selectRef.current) {
      selectRef.current!.focus({ preventScroll: true });
    }

    // Manually scroll the inner container as needed
    if (containerRef.current) {
      containerRef.current.style.height = "302px";
      containerRef.current!.scrollTo({
        top: 200, // Adjust this value as needed
        behavior: "instant",
      });
    }
  };

  const onBlur = () => {
    sizerRef.current!.style.height = "0";
    containerRef.current!.style.height = "100%";
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
        {t("quest")}
      </Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <div ref={containerRef} className="h-full overflow-x-hidden overflow-y-scroll">
          <div className="flex flex-col">
            <header className="px-4">
              <label className="block text-sm text-center font-medium text-black mb-2">
                {t("challenge-for")} {username}
              </label>
            </header>

            <section className="mb-2 px-4">
              <div className="px-5 py-3 border border-[#F6F6F6] rounded-[32px]">
                <label className="block text-xs font-light text-black/50">{t("category")}</label>

                <select
                  title=""
                  name="category"
                  value={selectedAchievement?.name || ""}
                  onChange={(e) => {
                    const selected = achievements.find((ach) => ach.name === e.target.value);
                    if (selected) {
                      setSelectedAchievement(selected);
                      setImageUrl(`https://getquest.tech/api/images/${selected.imageUrl}`);
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
                <label className="block text-xs font-light text-black/50">{t("task")}</label>
                <input type="text" value={task} onChange={(e) => setTask(e.target.value)} className="size-full focus:outline-none" />
              </div>
            </section>

            {imageUrl && (
              <div className="flex justify-center my-2 px-4">
                <img src={imageUrl} alt="Achievement" className="h-32 object-contain" />
              </div>
            )}

            <div className="size-32 bg-gray-200" />

            <div className="mb-4 px-4">
              <input type="text" value={numericValue} ref={selectRef as any} onFocus={handleFocus} onBlur={onBlur} onChange={(e) => setNumericValue(e.target.value.replace(/\D/g, ""))} className="w-full text-3xl font-black focus:outline-none text-center text-gradient placeholder:text-black/10 p-2" placeholder="0" />
            </div>

            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

            <footer className="flex flex-col gap-2 px-4">
              <Button isLoading={isLoading} onClick={handleSubmit} variant="secondary" className="w-full z-[9999]">
                {t("submit")}
              </Button>

              <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
                {t("cancel")}
              </Button>
            </footer>
          </div>
        </div>
        <div ref={sizerRef} />
      </Drawer>
    </>
  );
}
