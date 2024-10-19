"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "../slider"; // Компонент анимации для движения достижений
import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { AchievementDrawer } from "@/app/profile/drawer";


interface Achievement {
  userAchievement: number;
  name: string;
  imageUrl: string;
}

interface ChallengeData {
  id: number;
  description: string;
  videoUrl: string | null;
  price: number;
  sender: string;
}

interface UserData {
  id: number;
  username: string;
  name: string;
  rating: number;
  achievementListDTO: Achievement[];
  taskCount: number;
  earnedCount: number;
}

export default function ProfilePage({params}:{params:{username:string}}) {

  const [userData, setUserData] = useState<UserData | null>(null);
  const [achievementImages, setAchievementImages] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [videoResources, setVideoResources] = useState<
    { videoUrl: string; fileId: string }[]
  >([]);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const initDataRaw = useLaunchParams().initDataRaw;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const headers: HeadersInit = {
          accept: "*/*",
        };
        if (initDataRaw) {
          headers["initData"] = initDataRaw;
        }
        const response = await fetch(
          `https://getquest.tech:8443/api/users/profile/${params.username}?username=${params.username}`,
          {
            method: "GET",
            headers,
          }
        );
        const data: UserData = await response.json();
        setUserData(data);
        setAchievementImages(
          data.achievementListDTO.map(
            (achievement: Achievement) =>
              `https://getquest.tech:8443/images/${achievement.imageUrl}`
          )
        );
      } catch (error) {
        console.error("Ошибка при загрузке данных профиля:", error);
      }
    };

    fetchProfileData();
  }, [initDataRaw]);

  // Возвращаем функцию fetchVideoUrls для загрузки прошлых видео
  useEffect(() => {
    const fetchVideoUrls = async () => {
      if (!userData) return;

      try {
        const headers: HeadersInit = {
          accept: "*/*",
        };
        if (initDataRaw) {
          headers["initData"] = initDataRaw;
        }

        const response = await fetch(
          `https://getquest.tech:8443/api/challenges/user/video-urls?userId=${userData.id}`,
          {
            method: "GET",
            headers,
          }
        );
        const urls: string[] = await response.json();
        setVideoUrls(urls);
      } catch (error) {
        console.error("Ошибка при получении видео URL:", error);
      }
    };

    fetchVideoUrls();
  }, [userData, initDataRaw]);

  // Возвращаем функцию fetchVideoResources для загрузки видео
  useEffect(() => {
    const fetchVideoResources = async () => {
      if (videoUrls.length === 0) return;

      const headers: HeadersInit = {
        accept: "*/*",
      };
      if (initDataRaw) {
        headers["initData"] = initDataRaw;
      }

      const resources = await Promise.all(
        videoUrls.map(async (fileId) => {
          try {
            const response = await fetch(
              `https://getquest.tech:8443/api/videos/download?fileId=${fileId}`,
              {
                method: "GET",
                headers,
              }
            );

            if (response.ok) {
              const blob = await response.blob();
              const videoUrl = window.URL.createObjectURL(blob);
              return { videoUrl, fileId };
            } else {
              console.error(
                `Ошибка при загрузке видео ${fileId}:`,
                response.status
              );
              return null;
            }
          } catch (error) {
            console.error("Ошибка при загрузке видео:", error);
            return null;
          }
        })
      );

      setVideoResources(
        resources.filter(Boolean) as { videoUrl: string; fileId: string }[]
      );
    };

    fetchVideoResources();
  }, [videoUrls, initDataRaw]);

  // Обработчик клика по достижению
  const handleAchievementClick = async (index: number) => {
    const achievement = userData?.achievementListDTO[index];
    if (!achievement) return;

    setSelectedAchievement(achievement);

    // Получение данных задания по userAchievement
    try {
      const headers: HeadersInit = {
        accept: "*/*",
      };
      if (initDataRaw) {
        headers["initData"] = initDataRaw;
      }

      const response = await fetch(
        `https://getquest.tech:8443/api/challenges/achievement/${achievement.userAchievement}`,
        {
          method: "GET",
          headers,
        }
      );

      if (response.ok) {
        const data: ChallengeData[] = await response.json();
        if (data.length > 0) {
          setChallengeData(data[0]);
        }
      } else {
        console.error(
          `Ошибка при получении данных задания ${achievement.userAchievement}:`,
          response.status
        );
      }
    } catch (error) {
      console.error("Ошибка при получении данных задания:", error);
    }
  };

  // Функция для склонения числительных
  function getDeclension(
    n: number,
    one: string,
    few: string,
    many: string
  ): string {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) {
      return many;
    }
    if (n1 > 1 && n1 < 5) {
      return few;
    }
    if (n1 === 1) {
      return one;
    }
    return many;
  }

  if (!userData) {
    return <div>Загрузка...</div>;
  }

  return (
    <main className="relative flex flex-col items-center rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(80px+1rem)] overflow-hidden">
      <section className="flex flex-col justify-center items-center mb-16">
        <img
          className="relative left-1"
          src={Rewards.src}
          alt="Награды"
          width={80}
          height={80}
        />
        <h1 className="text-gradient text-3xl font-black">{userData.rating}</h1>
        <p className="text-black">@{userData.username}</p>
      </section>
      <section className="flex flex-col gap-3 mb-6">
        {/* Используем обновленный компонент Slider */}
        <Slider
          elements={achievementImages}
          onElementClick={handleAchievementClick}
        />
      </section>
      <section className="mb-6">
        <h1 className="text-black text-2xl text-left font-medium tracking-[-0.05em] mb-6">
          Выполнено{" "}
          <span className="text-gradient font-black">
            {userData.taskCount}
          </span>{" "}
          {getDeclension(
            userData.taskCount,
            "задание",
            "задания",
            "заданий"
          )}{" "}
          <img
            className="inline -left-1 top-0 relative"
            src={Rewards.src}
            alt="Награды"
            width={32}
            height={32}
          />
          <br />
          <img
            className="inline -left-1 relative"
            src={Arrows.src}
            alt="Стрелки"
            width={32}
            height={32}
          />
          заработано{" "}
          <span className="text-gradient">{userData.earnedCount}</span>{" "}
          репутации
        </h1>
      </section>
      {/* Возвращаем отображение прошлых видео */}
      <section className="video-slider flex flex-row gap-3 overflow-x-auto">
        {videoResources.length > 0 ? (
          videoResources.map(({ videoUrl, fileId }) => (
            <figure
              key={fileId}
              className="rounded-full overflow-hidden w-64 h-64 bg-[#F6F6F6] flex items-center justify-center"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                className="w-full h-full object-cover rounded-full"
                onClick={(e) => {
                  const video = e.currentTarget;
                  if (video.requestFullscreen) {
                    video.requestFullscreen();
                  } else if ((video as any).webkitEnterFullscreen) {
                    (video as any).webkitEnterFullscreen();
                  }
                  video.play();
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </figure>
          ))
        ) : (
          <div>Видео отсутствуют</div>
        )}
      </section>
      <nav className="fixed-nav fixed bottom-0 left-0 right-0 bg-white z-1000">
        <ul className="flex justify-around p-2">
          <li>Друзья</li>
          <li>Испытания</li>
          <li>Профиль</li>
        </ul>
      </nav>

      {selectedAchievement && (
        <AchievementDrawer
          isOpen={!!selectedAchievement}
          onClose={() => {
            setSelectedAchievement(null);
            setChallengeData(null);
          }}
          achievement={selectedAchievement}
          challengeData={challengeData}
          initDataRaw={initDataRaw || ""}
        />
      )}
    </main>
  );
}
