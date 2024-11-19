"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import Drawer from "@/components/ui/drawer";
import { api } from "@/lib/api";
import { BASE_URL } from "@/lib/const";
import { useTranslations } from "next-intl";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import useViewportHeight from "@/hooks/useViewportHeight";

// Интерфейс для результата анализа
interface TaskAnalysisResult {
  legally: boolean;
  dangerous: boolean;
  reason: string;
  achievementId: string | null;
  achievementName: string | null;
  achievementImageUrl: string | null;
}

type SubmitQuestDrawerProps = {
  username: string;
  receiverId: string;
  onClose?: () => void;
};

export function SubmitQuestDrawer({ username, receiverId, onClose }: SubmitQuestDrawerProps) {
  const t = useTranslations("friends");

  const viewportHeight = useViewportHeight();
  const { platform } = useLaunchParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sizerRef = useRef<HTMLDivElement | null>(null);

  const [selectedAchievement, setSelectedAchievement] = React.useState<{
    id: string | null;
    name: string | null;
    imageUrl: string | null;
  }>({ id: null, name: null, imageUrl: null });
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false); // Состояние для индикатора загрузки
  const [task, setTask] = React.useState("");
  const [numericValue, setNumericValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Используем интерфейс TaskAnalysisResult
  const [analysisResult, setAnalysisResult] = React.useState<TaskAnalysisResult | null>(null);
  const [warningMessage, setWarningMessage] = React.useState("");

  const handleCheckTask = async () => {
    if (!task) {
      setErrorMessage("Пожалуйста, введите задание.");
      return;
    }

    setIsChecking(true); // Начинаем загрузку

    try {
      const response = await api.post<TaskAnalysisResult>("/api/task/analyze", { task });

      if (response) {
        setAnalysisResult(response);

        if (response.legally === false) {
          setWarningMessage(response.reason);
        } else if (response.dangerous === true) {
          setWarningMessage(t("danger-warning"));
        } else {
          setWarningMessage("");
        }

        // Устанавливаем выбранное достижение на основе ответа
        setSelectedAchievement({
          id: response.achievementId,
          name: response.achievementName,
          imageUrl: response.achievementImageUrl,
        });
      }
    } catch (error) {
      setErrorMessage(t("error-server"));
    } finally {
      setIsChecking(false); // Завершаем загрузку
    }
  };

  const handleSubmit = async () => {
    if (!selectedAchievement.id || !task || !numericValue) {
      setErrorMessage("Пожалуйста, заполните все поля.");
      return;
    }

    if (analysisResult && analysisResult.legally === false) {
      setErrorMessage(analysisResult.reason);
      return;
    }

    setIsLoading(true);

    const body = {
      achievementId: selectedAchievement.id,
      description: task,
      receiverId,
      price: parseInt(numericValue, 10),
      danger: analysisResult?.dangerous || false,
    };

    try {
      await api.post("/api/challenges", body);

      setIsLoading(false);
      setIsOpen(false);
      onClose?.();
      alert(t("task-success-complete"));
    } catch (error) {
      const message =
        (error as any)?.status === 400
          ? "У вас недостаточно репутации для создания этого испытания."
          : t("error-server");
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  const handleFocus = (scrollFromTop?: number) => {
    if (!sizerRef.current || !containerRef.current) return;

    if (sizerRef.current && containerRef.current) {
      sizerRef.current.style.height = platform === "ios" ? viewportHeight + 200 + "px" : "100%";
      containerRef.current.style.height = platform === "ios" ? viewportHeight / 2 - 25 + "px" : "100%";

      if (scrollFromTop) {
        containerRef.current.scrollTo({
          top: scrollFromTop,
          behavior: "instant",
        });
      }
    }
  };

  const onBlur = () => {
    if (sizerRef.current && containerRef.current) {
      sizerRef.current.style.height = "20px";
      containerRef.current.style.height = "100%";
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        className="text-black bg-[#FEEF9E]"
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
                <label className="block text-xs font-light text-black/50">{t("task")}</label>
                <div className="flex">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onFocus={() => handleFocus()}
                    onBlur={onBlur}
                    className="size-full focus:outline-none flex-grow"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleCheckTask}
                    className="ml-2"
                    isLoading={isChecking} // Добавляем индикатор загрузки
                  >
                    {t("check")}
                  </Button>
                </div>
              </div>
            </section>

            {warningMessage && (
              <div className="mb-2 px-4 text-red-500">
                {warningMessage}
              </div>
            )}

            {selectedAchievement.imageUrl && (
              <div className="flex justify-center my-2 px-4">
                <img
                  src={`${BASE_URL}/api/images/${selectedAchievement.imageUrl}`}
                  alt={selectedAchievement.name || "Achievement"}
                  className="h-32 object-contain"
                />
              </div>
            )}

            <div className="mb-4 px-4">
              <input
                type="text"
                value={numericValue}
                onFocus={() => handleFocus(200)}
                onBlur={onBlur}
                onChange={(e) => setNumericValue(e.target.value.replace(/\D/g, ""))}
                className="w-full text-3xl font-black focus:outline-none text-center text-gradient placeholder:text-black/10 p-2"
                placeholder="0"
              />
            </div>

            {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

            <footer className="flex flex-col gap-2 px-4">
              <Button
                isLoading={isLoading}
                onClick={handleSubmit}
                variant="secondary"
                className="w-full z-[9999]"
                disabled={!selectedAchievement.id} // Делаем кнопку недоступной, пока нет achievementId
              >
                {t("submit")}
              </Button>

              <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
                {t("cancel")}
              </Button>
            </footer>
          </div>
        </div>
        <div className="h-[20px]" ref={sizerRef} />
      </Drawer>
    </>
  );
}
