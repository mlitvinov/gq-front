"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import Rewards from "@/assets/rewards.png";
import { BASE_URL } from "@/lib/const";
import { Goal } from "../types";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import Drawer from "@/components/ui/drawer";

type GoalDrawerProps = {
  isOpen: boolean;
  goal: Goal;
  onClose: () => void;
  refreshChallenges: () => void;
};

export function GoalDrawer({
  isOpen,
  onClose,
  goal,
  refreshChallenges,
}: GoalDrawerProps) {
  const initDataRaw = useLaunchParams().initDataRaw;
  const [isLoadingClaim, setIsLoadingClaim] = React.useState(false); // Добавлено состояние загрузки

  // Функция для обработки получения награды
  const handleClaimReward = async (goalId: number) => {
    if (!initDataRaw) return;

    setIsLoadingClaim(true); // Начало загрузки

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/goals/${goalId}/claim`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        console.error(
          "Ошибка при отправке запроса на получение награды:",
          response.statusText
        );
        // Здесь можно добавить отображение сообщения об ошибке пользователю, если необходимо
        return;
      }

      // Обновляем список целей после получения награды
      refreshChallenges();
      onClose();
    } catch (error) {
      console.error(
        "Произошла ошибка при отправке запроса на получение награды:",
        error
      );
      // Здесь можно добавить отображение сообщения об ошибке пользователю, если необходимо
    } finally {
      setIsLoadingClaim(false); // Завершение загрузки
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <img
          src={`https://getquest.tech/api/images/${goal.picUrl}`}
          alt={goal.name}
          className="w-full h-40 aspect-square object-contain select-none pointer-events-none rounded-md mb-4"
        />
        <header className="flex flex-col items-center">
          <h1 id="challenge-title" className="text-xl font-bold">
            {goal.name}
          </h1>

          <p className="text-3xl text-gradient mi-2 font-black">
            <span className="mr-1">{goal.rewardPoints}</span>
            <img
              className="inline relative -top-0.5"
              src={Rewards.src}
              alt="Награды"
              height={32}
              width={32}
            />
          </p>
        </header>
        <p
          id="challenge-description"
          className="mt-4 mb-8 px-4 text-center font-medium text-sm"
        >
          {goal.description}
        </p>

        <footer className="flex flex-col gap-2 px-4">
          {goal.status === "COMPLETED" && (
            <Button
              variant="secondary"
              onClick={() => handleClaimReward(goal.id)}
              isLoading={isLoadingClaim} // Добавлен пропс isLoading
              disabled={isLoadingClaim} // Опционально: отключение кнопки во время загрузки
            >
              Забрать вознаграждение
            </Button>
          )}
        </footer>
      </div>
    </Drawer>
  );
}
