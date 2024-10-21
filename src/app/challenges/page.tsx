"use client";

import { useEffect, useRef, useState } from "react";
import { useLaunchParams } from "@telegram-apps/sdk-react";

import Rewards from "@/assets/rewards.png";
import { ChallengeDrawer } from "@/app/challenges/drawer";
import { Button } from "@/components/ui/button";

type Challenge = {
  id: number;
  description: string;
  achievementTitle: string;
  achievementPicsUrl: string;
  price: number;
  status: string;
  senderUserName?: string;
  receiverUserName?: string;
  videoUrl?: string | null;
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
      bars = 3;
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
  const [currentTab, setCurrentTab] = useState<"assigned" | "sent">("assigned");
  const initDataRaw = useLaunchParams().initDataRaw;

  const fetchChallenges = async () => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (initDataRaw) headers["initData"] = initDataRaw;

    try {
      const endpoint =
        currentTab === "assigned"
          ? "https://getquest.tech:8443/api/challenges/assigned"
          : "https://getquest.tech:8443/api/challenges/sent";

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

  const hideChallenge = async (id: number) => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите скрыть это задание?"
    );
    if (!confirmed) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (initDataRaw) headers["initData"] = initDataRaw;

    try {
      const response = await fetch(
        `https://getquest.tech:8443/api/challenges/${id}/hide`,
        { method: "PUT", headers }
      );

      if (!response.ok) {
        console.error("Ошибка при скрытии задания:", response.statusText);
        return;
      }

      await fetchChallenges(); // Обновляем список заданий
    } catch (error) {
      console.error("Произошла ошибка при скрытии задания:", error);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [initDataRaw, currentTab]);

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

      <div className="mt-40 rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(80px+1rem)]">
        <div className="flex justify-around mb-4">
          <button
            className={`px-4 py-2 ${
              currentTab === "assigned" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setCurrentTab("assigned")}
          >
            Назначенные
          </button>
          <button
            className={`px-4 py-2 ${
              currentTab === "sent" ? "border-b-2 border-black" : ""
            }`}
            onClick={() => setCurrentTab("sent")}
          >
            Отправленные
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {challenges.map((challenge) => {
            const { bars, color } = getStatusBars(challenge.status);

            return (
              <div
                key={challenge.id}
                className="flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4"
              >
                <div className="flex gap-2 items-center">
                  <img
                    src={`https://getquest.tech:8443/images/${challenge.achievementPicsUrl}`}
                    alt={challenge.achievementTitle}
                    className="size-12 bg-[#F6F6F6] rounded-xl"
                  />
                  <div
                    className="flex-grow"
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    <div className="text-black font-semibold">
                      {challenge.achievementTitle}
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
                  {(challenge.status === "DISPUTED" ||
                    challenge.status === "DECLINED" ||
                    challenge.status === "APPROVE") && (
                    <Button
                      variant="ghost"
                      onClick={() => hideChallenge(challenge.id)}
                    >
                      ✖
                    </Button>
                  )}
                </div>

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
              </div>
            );
          })}
        </div>
      </div>

      {selectedChallenge && (
        <ChallengeDrawer
          isOpen={!!selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          achievementPicsUrl={selectedChallenge.achievementPicsUrl}
          achievementTitle={selectedChallenge.achievementTitle}
          reputation={selectedChallenge.price}
          senderName={
            currentTab === "assigned"
              ? `@${selectedChallenge.senderUserName}`
              : `@${selectedChallenge.receiverUserName}`
          }
          description={selectedChallenge.description}
          status={selectedChallenge.status}
          isSent={currentTab === "sent"}
          challengeId={selectedChallenge.id}
          initDataRaw={initDataRaw || ""}
          refreshChallenges={fetchChallenges}
          videoUrl={selectedChallenge.videoUrl}
        />
      )}
    </main>
  );
}
