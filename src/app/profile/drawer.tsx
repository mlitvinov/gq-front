"use client";

import React from "react";

import Rewards from "@/assets/rewards.png";
import { Link } from "@/components/Link/Link";
import Drawer from "@/components/ui/drawer";
import { Carousel } from "@/components/carousel";

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
  senderId: number | null;
  achievementId: number;
};

type AchievementDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement;
  challengeData: ChallengeData[] | null;
};

export function AchievementDrawer({
                                    isOpen,
                                    onClose,
                                    achievement,
                                    challengeData,
                                  }: AchievementDrawerProps) {
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
                {/* Удаляем отображение отправителя из карточки достижения */}
              </div>
            </div>
          </div>
        </div>

        {challengeData && challengeData.length > 0 ? (
          <Carousel
            options={{
              loop: true,
              align: "center",
            }}
            itemClassName="w-full"
            items={challengeData.map((el, index) => (
              <div key={index}>
                <div className="flex size-64 relative mx-auto rounded-full justify-center my-4">
                  <div className="absolute z-0 inset-0 bg-slate-50 rounded-full animate-pulse" />
                  {el.videoUrl && (
                    <video
                      src={`https://getquest.tech:8443/api/videos/download?fileId=${el.videoUrl}`}
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

                {/* Описание испытания и отправитель */}
                <header>
                  <h1
                    id="achievement-title"
                    className="text-xl text-center font-bold"
                  >
                    <p className="text-3xl text-gradient ml-4 font-black">
                      <span className="mr-1">{el.price}</span>
                      <img
                        className="inline relative -top-0.5"
                        src={Rewards.src}
                        alt="Награды"
                        height={32}
                        width={32}
                      />
                    </p>
                  </h1>
                </header>
                <main
                  id="achievement-description"
                  className="mt-2 mb-8 px-4 text-center text-sm"
                >
                  {/* Отображаем имя отправителя для каждого испытания */}
                  {el.senderId ? (
                    <Link
                      href={`/profile/${el.senderId}`}
                      className="text-sm text-gray-600"
                    >
                      {el.sender}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-600">{el.sender}</span>
                  )}
                  <br />
                  {el.description}
                </main>
              </div>
            ))}
          />
        ) : (
          <div className="h-[400px]" />
        )}
      </div>
    </Drawer>
  );
}
