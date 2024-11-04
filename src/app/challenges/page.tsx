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

const getStatusBars = (status: string) => {
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
      bars = 4;
      color = "#4CAF50";
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
  }

  return { bars, color };
};

export default function ChallengesPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [tab, setTab] = useState<"promo" | "assigned" | "sent">("promo");
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
      }

      const response = await fetch(endpoint, { method: "GET", headers });

      if (!response.ok) {
        console.error("Ошибка при получении данных:", response.statusText);
        return;
      }

      const data: Challenge[] = await response.json();

      setChallenges(data);
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
          <button
            className={cn(
              "flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2",
              tab === "promo" && "text-black after:bg-[#FEEE9E]"
            )}
            onClick={() => setTab("promo")}
          >
            Промо
          </button>
          <button
            className={cn(
              "flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2",
              tab === "assigned" && "text-black after:bg-[#FEEE9E]"
            )}
            onClick={() => setTab("assigned")}
          >
            От друзей
          </button>
          <button
            className={cn(
              "flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2",
              tab === "sent" && "text-black after:bg-[#FEEE9E]"
            )}
            onClick={() => setTab("sent")}
          >
            Отправленные
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-24">
          {challenges.map((challenge) => {
            const { bars, color } = getStatusBars(challenge.status);
            const isPromo = tab === "promo";

            return (
              <div
                key={challenge.id}
                className="flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={
                      isPromo
                        ? `https://getquest.tech:8443/images/${challenge.promoAchievementPicsUrl}`
                        : `https://getquest.tech:8443/images/${challenge.achievementPicsUrl}`
                    }
                    alt={
                      isPromo
                        ? challenge.promoAchievementTitle || "Промо испытание"
                        : challenge.achievementTitle
                    }
                    className="size-12 bg-[#F6F6F6] rounded-xl"
                  />
                  <div
                    className="flex-grow"
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    <div className="text-black font-semibold">
                      {isPromo
                        ? challenge.promoAchievementTitle
                        : challenge.achievementTitle}
                    </div>
                    <div className="text-gradient">
                      {challenge.price}{" "}
                      <img
                        className="inline relative -top-0.5 -left-1"
                        src={Rewards.src}
                        alt="Награды"
                        height={18}
                        width={18}
                      />
                    </div>
                  </div>
                </div>

                {!isPromo || challenge.status !== "PENDING" ? (
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

      {selectedChallenge && (
        <ChallengeDrawer
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          achievementPicsUrl={
            tab === "promo"
              ? selectedChallenge.promoAchievementPicsUrl || ""
              : selectedChallenge.achievementPicsUrl || ""
          }
          achievementTitle={
            tab === "promo"
              ? selectedChallenge.promoAchievementTitle || ""
              : selectedChallenge.achievementTitle || ""
          }
          reputation={selectedChallenge.price}
          senderName={
            tab === "assigned"
              ? `@${selectedChallenge.senderUserName}`
              : tab === "sent"
                ? `@${selectedChallenge.receiverUserName}`
                : "Промо"
          }
          description={selectedChallenge.description}
          status={selectedChallenge.status}
          isSent={tab === "sent"}
          isPromo={tab === "promo"}
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
