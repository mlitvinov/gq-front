"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import Rewards from "@/app/_assets/rewards.png";
import { BASE_URL } from "@/lib/const";

import Drawer from "@/components/ui/drawer";
import { Goal } from "@/types/entities";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";

type GoalDrawerProps = {
  isOpen: boolean;
  goal: Goal;
  onClose: () => void;
  refreshChallenges: () => Promise<void>;
};

export function GoalDrawer({ isOpen, onClose, goal, refreshChallenges }: GoalDrawerProps) {
  const [isLoadingClaim, setIsLoadingClaim] = React.useState(false); // Добавлено состояние загрузки

  const t = useTranslations("challenges");

  // Функция для обработки получения награды
  const handleClaimReward = async (goalId: number) => {
    setIsLoadingClaim(true);

    try {
      await api.post(`/api/goals/${goalId}/claim`);

      await refreshChallenges();
      onClose();
      setIsLoadingClaim(false);
    } catch (error) {
      console.error("Произошла ошибка при отправке запроса на получение награды:", error);
      setIsLoadingClaim(false);
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <img src={`${BASE_URL}/api/images/${goal.picUrl}`} alt={goal.name} className="w-full h-40 aspect-square object-contain select-none pointer-events-none rounded-md mb-4" />
        <header className="flex flex-col items-center">
          <h1 id="challenge-title" className="text-xl font-bold">
            {goal.name}
          </h1>

          <p className="text-3xl text-gradient mi-2 font-black">
            <span className="mr-1">{goal.rewardPoints}</span>
            <img className="inline relative -top-0.5" src={Rewards.src} alt="Награды" height={32} width={32} />
          </p>
        </header>
        <p id="challenge-description" className="mt-4 mb-8 px-4 text-center font-medium text-sm">
          {goal.description}
        </p>

        <footer className="flex flex-col gap-2 px-4">
          {goal.status === "COMPLETED" && (
            <Button variant="secondary" onClick={() => handleClaimReward(goal.id)} isLoading={isLoadingClaim} disabled={isLoadingClaim}>
              {t("collect-reward")}
            </Button>
          )}
        </footer>
      </div>
    </Drawer>
  );
}
