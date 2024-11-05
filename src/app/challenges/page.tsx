"use client";

import { useEffect, useRef, useState } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";

import Rewards from "@/assets/rewards.png";
import { ChallengeDrawer } from "@/app/challenges/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/lib/const";

type Challenge = {
  id: number;
  description: string;
  achievementTitle?: string;
  achievementPicsUrl?: string;
  promoAchievementTitle?: string;
  promoAchievementPicsUrl?: string;
  price: number;
  status: string;
  senderUserName?: string;
  receiverUserName?: string;
  videoUrl?: string | null;
  taskUrl?: string;
};

type Goal = {
  id: number;
  description: string;
  picUrl: string;
  name: string;
  targetCount: number;
  currentCount: number;
  status: string;
  rewardPoints: number;
  completionCount?: number;
  currentTargetCount?: number;
};

const getStatusBars = (status: string, isPromoOrTarget: boolean) => {
  let bars = 1;
  let color = "#FEEE9E";

  switch (status) {
    case "PENDING":
      bars = 1;
      break;
    case "ACCEPTED":
      bars = 2;
      break;
    case "COMPLETED":
      if (isPromoOrTarget) {
        bars = 4;
        color = "#4CAF50";
      } else {
        bars = 3;
        color = "#FEEE9E";
      }
      break;
    case "APPROVE":
      bars = 4;
      color = "#4CAF50";
      break;
    case "DISPUTED":
      bars = 4;
      color = "#F44336";
      break;
    case "DECLINED":
      bars = 1;
      color = "#F44336";
      break;
    case "REWARDED":
      bars = 4;
      color = "#C0C0C0";
      break;
    case "IN_PROGRESS":
      bars = 0;
      break;
  }

  return { bars, color };
};

export default function ChallengesPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null); // Изменили тип на any
  const [tab, setTab] = useState<"promo" | "targets" | "assigned" | "sent">(
    "promo"
  );
  const initDataRaw = useLaunchParams().initDataRaw;

  const fetchChallenges = async () => {
    if (!initDataRaw) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    try {
      let endpoint = "";

      if (tab === "assigned") {
        endpoint = `${BASE_URL}/api/challenges/assigned`;
      } else if (tab === "sent") {
        endpoint = `${BASE_URL}/api/challenges/sent`;
      } else if (tab === "promo") {
        endpoint = `${BASE_URL}/api/promochallenges`;
      } else if (tab === "targets") {
        endpoint = `${BASE_URL}/api/goals`;
      }

      const response = await fetch(endpoint, { method: "GET", headers });

      if (!response.ok) {
        console.error(
          "Ошибка при получении данных:",
          response.statusText
        );
        return;
      }

      if (tab === "targets") {
        const data: Goal[] = await response.json();
        setGoals(data);
      } else {
        const data: Challenge[] = await response.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error("Произошла ошибка при получении данных:", error);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [initDataRaw, tab]);

  return (
    <main className="relative flex flex-col">
      <div
        ref={ref}
        className="bg-white h-48 overflow-hidden absolute inset-x-0 top-0 -z-10"
      >
        <video
          loop
          autoPlay
          muted
          playsInline
          controls={false}
          preload="metadata"
          src="/gradient.webm"
          className="size-full pointer-events-none object-cover"
        />
      </div>

      <div className="mt-40 rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(var(--nav-height)+1rem)]">
        <div className="flex justify-around mb-4">
          {/* Ваши кнопки переключения вкладок */}
        </div>

        <div className="flex flex-col gap-3 mb-24">
          {tab === "targets"
            ? goals.map((goal) => {
              const { bars, color } = getStatusBars(goal.status, true);

              return (
                <div
                  key={goal.id}
                  className={`flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4 ${
                    goal.status === "REWARDED" ? "opacity-50" : ""
                  }`}
                  onClick={() => setSelectedChallenge({ ...goal, isGoal: true })}
                >
                  {/* Отображение цели */}
                </div>
              );
            })
            : challenges.map((challenge) => {
              const isPromo = tab === "promo";
              const { bars, color } = getStatusBars(challenge.status, isPromo);

              return (
                <div
                  key={challenge.id}
                  className="flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4"
                  onClick={() => setSelectedChallenge({ ...challenge, isGoal: false })}
                >
                  {/* Отображение испытания */}
                </div>
              );
            })}
        </div>
      </div>

      {selectedChallenge && (
        <ChallengeDrawer
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          achievementPicsUrl={
            selectedChallenge.isGoal
              ? selectedChallenge.picUrl
              : tab === "promo"
                ? selectedChallenge.promoAchievementPicsUrl || ""
                : selectedChallenge.achievementPicsUrl || ""
          }
          achievementTitle={
            selectedChallenge.isGoal
              ? selectedChallenge.name
              : tab === "promo"
                ? selectedChallenge.promoAchievementTitle || ""
                : selectedChallenge.achievementTitle || ""
          }
          reputation={
            selectedChallenge.isGoal
              ? selectedChallenge.rewardPoints
              : selectedChallenge.price
          }
          senderName={
            selectedChallenge.isGoal
              ? ""
              : tab === "assigned"
                ? `@${selectedChallenge.senderUserName}`
                : tab === "sent"
                  ? `@${selectedChallenge.receiverUserName}`
                  : "Промо"
          }
          description={selectedChallenge.description}
          status={selectedChallenge.status}
          isSent={tab === "sent"}
          isPromo={tab === "promo"}
          isGoal={selectedChallenge.isGoal}
          challengeId={selectedChallenge.id}
          initDataRaw={initDataRaw || ""}
          refreshChallenges={fetchChallenges}
          fieldId={selectedChallenge.videoUrl}
          taskUrl={selectedChallenge.taskUrl}
        />
      )}
    </main>
  );
}
