"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import Rewards from "@/assets/rewards.png";
import { BASE_URL } from "@/lib/const";
import { Goal } from "../types";
import { useLaunchParams } from "@telegram-apps/sdk-react";

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

  // Функция для обработки получения награды
  const handleClaimReward = async (goalId: number) => {
    if (!initDataRaw) return;

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
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        aria-describedby="challenge-description"
        aria-labelledby="challenge-title"
      >
        <div className="mx-auto w-full max-w-sm">
          <img
            src={`https://getquest.tech:8443/images/${goal.picUrl}`}
            alt={goal.name}
            className="w-full h-40 aspect-square object-contain select-none pointer-events-none rounded-md mb-4"
          />
          <DrawerHeader>
            <DrawerTitle id="challenge-title" className="text-xl font-bold">
              {goal.name}
            </DrawerTitle>

            <p className="text-3xl text-gradient ml-4 font-black">
              <span className="mr-1">{goal.rewardPoints}</span>
              <img
                className="inline relative -top-0.5"
                src={Rewards.src}
                alt="Награды"
                height={32}
                width={32}
              />
            </p>
          </DrawerHeader>
          <DrawerDescription
            id="challenge-description"
            className="mt-4 mb-8 px-4 text-center font-medium text-sm"
          >
            {goal.description}
          </DrawerDescription>

          <DrawerFooter className="flex flex-col gap-2 px-4">
            {goal.status === "COMPLETED" && (
              <Button
                variant="secondary"
                onClick={() => handleClaimReward(goal.id)}
              >
                Забрать вознаграждение
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
