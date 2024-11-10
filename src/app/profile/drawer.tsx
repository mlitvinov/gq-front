"use client";

import * as React from "react";

import Rewards from "@/assets/rewards.png";
import { Link } from "@/components/Link/Link";
import Drawer from "@/components/ui/drawer";

type Achievement = {
  userAchievement: number;
  name: string;
  imageUrl: string;
};

type ChallengeData = {
  id: number;
  description: string;
  videoUrl: string | null;
  price: number;
  sender: string;
  senderId: number;
};

type AchievementDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement;
  challengeData: ChallengeData | null;
  initDataRaw: string;
};

export function AchievementDrawer({
  isOpen,
  onClose,
  achievement,
  challengeData,
  initDataRaw,
}: AchievementDrawerProps) {
  const [videoSrc, setVideoSrc] = React.useState<string | null>(null);

  // Загружаем видео при наличии videoUrl
  React.useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    if (challengeData?.videoUrl) {
      const fetchVideo = async () => {
        try {
          const headers: HeadersInit = {
            accept: "*/*",
          };
          if (initDataRaw) {
            headers["initData"] = initDataRaw;
          }

          const response = await fetch(
            `https://getquest.tech:8443/api/videos/download?fileId=${challengeData.videoUrl}`,
            {
              method: "GET",
              headers,
            }
          );

          if (response.ok) {
            const blob = await response.blob();
            objectUrl = window.URL.createObjectURL(blob);
            if (isMounted) {
              setVideoSrc(objectUrl);
            }
          } else {
            console.error(
              `Ошибка при загрузке видео ${challengeData.videoUrl}:`,
              response.status
            );
          }
        } catch (error) {
          console.error("Ошибка при загрузке видео:", error);
        }
      };

      fetchVideo();
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [challengeData, initDataRaw]);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center w-full">
        {/* Карточка достижения */}
        <div className="mt-6 w-full px-4">
          <div className="flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4">
            <div className="flex gap-2 items-center">
              <img
                src={`https://getquest.tech:8443/api/images/${achievement.imageUrl}`}
                alt={achievement.name}
                className="size-12 bg-[#F6F6F6] rounded-xl"
              />
              <div className="flex-grow">
                <div className="text-black font-semibold">
                  {achievement.name}
                </div>
                {challengeData && (
                  <div className="text-gradient">
                    {challengeData.price}{" "}
                    <img
                      className="inline relative -top-0.5 -left-1"
                      src={Rewards.src}
                      alt="Награды"
                      height={18}
                      width={18}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Видео */}
        <div className="flex size-64 relative rounded-full justify-center my-4">
          <div className="absolute z-0 inset-0 bg-slate-50 rounded-full animate-pulse" />
          {videoSrc && (
            <video
              src={videoSrc}
              className="size-full z-10 absolute inset-0 rounded-full object-cover"
              controls={false}
              muted
              playsInline
              autoPlay
              onClick={(e) => {
                const video = e.currentTarget;
                if (video.requestFullscreen) {
                  video.requestFullscreen();
                } else if ((video as any).webkitEnterFullscreen) {
                  (video as any).webkitEnterFullscreen();
                }
                video.play();
              }}
            />
          )}
        </div>

        {/* Описание и отправитель */}
        {challengeData && (
          <>
            <header>
              <h1 id="achievement-title" className="text-xl font-bold">
                {achievement.name}
              </h1>
            </header>
            <main
              id="achievement-description"
              className="mt-4 mb-8 px-4 text-center text-sm"
            >
              {challengeData.description}
              <br />
              <p className="text-sm text-gray-600">
                Отправитель:{" "}
                <Link
                  href={`/profile/${challengeData.senderId}`}
                  className="text-sm text-gray-600"
                >
                  {challengeData.sender}
                </Link>
              </p>
            </main>
          </>
        )}
      </div>
    </Drawer>
  );
}
