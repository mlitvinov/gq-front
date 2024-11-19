"use client";

import { useEffect, useRef, useState } from "react";

import Rewards from "@/app/_assets/rewards.png";
import { ChallengeDrawer } from "./drawers/challenge-drawer";
import { GoalDrawer } from "./drawers/goal-drawer";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/lib/const";
import { Challenge, Goal } from "@/types/entities";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";

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
        color = "#ABD6E0";
      } else {
        bars = 3;
        color = "#FEEE9E";
      }
      break;
    case "APPROVE":
      bars = 4;
      color = "#ABD6E0";
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
  const t = useTranslations("challenges");

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [tab, setTab] = useState<"promo" | "targets" | "assigned" | "sent">("promo");

  const fetchChallenges = async () => {
    try {
      let endpoint = null;

      if (tab === "assigned") {
        endpoint = `/api/challenges/assigned`;
      } else if (tab === "sent") {
        endpoint = `/api/challenges/sent`;
      } else if (tab === "promo") {
        endpoint = `/api/promochallenges`;
      } else if (tab === "targets") {
        endpoint = `/api/goals`;
      }

      if (!endpoint) return;

      const data = await api.get<Goal[] | Challenge[]>(endpoint);

      if (tab === "targets") {
        setGoals(data as Goal[]);
      } else {
        setChallenges(data as Challenge[]);
      }
    } catch (error) {
      console.error(t("error-data"), error);
    }
  };

  useEffect(() => {
    setGoals([]);
    setChallenges([]);

    fetchChallenges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <main className="relative flex flex-col">
      <div ref={ref} className="bg-white h-48 overflow-hidden absolute inset-x-0 top-0 -z-10">
        <video loop autoPlay muted playsInline controls={false} preload="metadata" className="size-full pointer-events-none object-cover">
          <source src="/gradient.webm" type="video/webm" />
          <source src="/gradient.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="mt-40 rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(var(--nav-height)+1rem)]">
        <div className="flex justify-around mb-4">
          <button className={cn("flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2", tab === "targets" && "text-black after:bg-[#FEEE9E]")} onClick={() => setTab("targets")}>
            {t("quest-goals")}
          </button>
          <button className={cn("flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2", tab === "promo" && "text-black after:bg-[#FEEE9E]")} onClick={() => setTab("promo")}>
            {t("quest-promo")}
          </button>
          <button className={cn("flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2", tab === "assigned" && "text-black after:bg-[#FEEE9E]")} onClick={() => setTab("assigned")}>
            {t("quest-friends")}
          </button>
          <button className={cn("flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2", tab === "sent" && "text-black after:bg-[#FEEE9E]")} onClick={() => setTab("sent")}>
            {t("quest-for-friends")}
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-24">
          {tab === "targets"
            ? goals.map((goal) => {
                const { bars, color } = getStatusBars(goal.status, true);

                return (
                  <button key={goal.id} type="button" className={`flex flex-col  border rounded-full border-[#fcf4f4] px-6 py-4 ${goal.status === "REWARDED" ? "opacity-50" : ""}`} onClick={() => setSelectedGoal(goal)}>
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex gap-2 items-start">
                        <img src={`${BASE_URL}/api/images/${goal.picUrl}`} alt={goal.name} className="size-12 bg-[#F6F6F6] rounded-xl" />
                        <div className="flex-grow">
                          <div className="text-black font-semibold">{goal.name}</div>
                          <p className="text-gradient text-start">
                            {goal.rewardPoints} <img className="inline relative -top-0.5 -left-1" src={Rewards.src} height={18} width={18} />
                          </p>
                        </div>
                      </div>
                      {/* Отображение прогресса */}
                      <div className="font-semibold text-gradient text-gray-500 ml-auto">
                        {goal.currentCount}/{goal.targetCount}
                      </div>
                    </div>

                    {bars > 0 ? (
                      <div className="flex gap-[10px] mt-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <figure
                            key={index}
                            className="h-[5px] grow rounded-full"
                            style={{
                              backgroundColor: index < bars ? color : "#F6F6F6",
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </button>
                );
              })
            : challenges.map((challenge) => {
                const isPromo = tab === "promo";
                const { bars, color } = getStatusBars(challenge.status, isPromo);

                return (
                  <div key={challenge.id} className="flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4">
                    <div className="flex gap-2 items-center">
                      <img src={isPromo ? `${BASE_URL}/api/images/${challenge.promoAchievementPicsUrl}` : `${BASE_URL}/api/images/${challenge.achievementPicsUrl}`} className="size-12 bg-[#F6F6F6] rounded-xl" />
                      <div className="flex-grow" onClick={() => setSelectedChallenge(challenge)}>
                        <div className="text-black font-semibold">{isPromo ? challenge.promoAchievementTitle : challenge.achievementTitle}</div>
                        <div className="text-gradient">
                          {challenge.price} <img className="inline relative -top-0.5 -left-1" src={Rewards.src} height={18} width={18} />
                        </div>
                      </div>
                    </div>

                    {bars > 0 ? (
                      <div className="flex gap-[10px] mt-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <figure
                            key={index}
                            className="h-[5px] grow rounded-full"
                            style={{
                              backgroundColor: index < bars ? color : "#F6F6F6",
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
        </div>
      </div>

      {selectedChallenge && tab !== "targets" && (
        <ChallengeDrawer
          isOpen={!!selectedChallenge}
          onClose={() => {
            setSelectedChallenge(null);
          }}
          achievementPicsUrl={tab === "promo" ? selectedChallenge.promoAchievementPicsUrl || "" : selectedChallenge.achievementPicsUrl || ""}
          achievementTitle={tab === "promo" ? selectedChallenge.promoAchievementTitle || "" : selectedChallenge.achievementTitle || ""}
          reputation={selectedChallenge.price}
          senderName={tab === "assigned" ? `@${selectedChallenge.senderUserName}` : tab === "sent" ? `@${selectedChallenge.receiverUserName}` : t("promo-challenge")}
          userId={tab === "assigned" ? selectedChallenge.senderId : tab === "sent" ? selectedChallenge.receiverId : 0}
          description={selectedChallenge.description}
          status={selectedChallenge.status}
          isSent={tab === "sent"}
          isPromo={tab === "promo"}
          challengeId={selectedChallenge.id}
          refreshChallenges={fetchChallenges}
          danger={selectedChallenge.danger}
          fieldId={selectedChallenge.videoUrl}
          taskUrl={selectedChallenge.taskUrl}
        />
      )}
      {selectedGoal && (
        <GoalDrawer
          isOpen={!!selectedGoal}
          onClose={() => {
            setSelectedGoal(null);
          }}
          goal={selectedGoal}
          refreshChallenges={fetchChallenges}
        />
      )}
    </main>
  );
}
