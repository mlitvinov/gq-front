"use client";

import React, { useEffect, useState } from "react";
import Slider from "./slider"; // Компонент анимации для движения достижений
import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { AchievementDrawer } from "@/app/profile/drawer";
import { Button } from "@/components/ui/button";

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
  senderId: number;
}

interface UserData {
  id: number;
  username: string;
  name: string;
  friendStatus: "FRIEND" | "REQUESTED" | "NOT_FRIEND" | "WAITING";
  rating: number;
  achievementListDTO: Achievement[];
  taskCount: number;
  earnedCount: number;
}

export default function ProfilePage({
                                      params,
                                    }: {
  params?: { id: number };
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [achievementImages, setAchievementImages] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(
    null
  );
  const [isLoadingAddFriend, setIsLoadingAddFriend] = useState(false);
  const [isLoadingAcceptFriend, setIsLoadingAcceptFriend] = useState(false);
  const initDataRaw = useLaunchParams().initDataRaw;

  const isUserPage = !params?.id;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const headers: HeadersInit = {
          accept: "*/*",
        };
        if (initDataRaw) {
          headers["initData"] = initDataRaw;
        }

        const url = !isUserPage
          ? `https://getquest.tech:8443/api/users/profile/?id=${params?.id}`
          : "https://getquest.tech:8443/api/users/profile";

        const response = await fetch(url, {
          method: "GET",
          headers,
        });
        const data: UserData = await response.json();
        setUserData(data);
        setAchievementImages(
          data.achievementListDTO.map(
            (achievement: Achievement) =>
              `https://getquest.tech:8443/api/images/${achievement.imageUrl}`
          )
        );
      } catch (error) {
        console.error("Ошибка при загрузке данных профиля:", error);
      }
    };

    fetchProfileData();
  }, [initDataRaw]);

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

  const handleAchievementClick = async (index: number) => {
    if (!initDataRaw) return;

    const achievement = userData?.achievementListDTO[index];
    if (!achievement) return;

    setSelectedAchievement(achievement);

    try {
      const headers: HeadersInit = {
        accept: "*/*",
        initData: initDataRaw,
      };

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

  const handleAddFriend = async () => {
    if (!userData) return;

    setIsLoadingAddFriend(true);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        accept: "*/*",
      };
      if (initDataRaw) {
        headers["initData"] = initDataRaw;
      }
      const response = await fetch(
        `https://getquest.tech:8443/friends/request?receiverId=${userData.id}`,
        {
          method: "POST",
          headers,
        }
      );
      if (response.ok) {
        setUserData((prevData) =>
          prevData ? { ...prevData, friendStatus: "REQUESTED" } : prevData
        );
      } else {
        console.error("Ошибка при отправке запроса в друзья:", response.status);
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса в друзья:", error);
    } finally {
      setIsLoadingAddFriend(false);
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!userData) {
      console.error("Данные пользователя отсутствуют.");
      return;
    }

    setIsLoadingAcceptFriend(true);
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        accept: "*/*",
      };
      if (initDataRaw) {
        headers["initData"] = initDataRaw;
      }
      const response = await fetch(
        `https://getquest.tech:8443/friends/accept/${userData.id}`,
        {
          method: "POST",
          headers,
        }
      );
      if (response.ok) {
        setUserData((prevData) =>
          prevData ? { ...prevData, friendStatus: "FRIEND" } : prevData
        );
      } else {
        console.error("Ошибка при принятии запроса в друзья:", response.status);
      }
    } catch (error) {
      console.error("Ошибка при принятии запроса в друзья:", error);
    } finally {
      setIsLoadingAcceptFriend(false);
    }
  };

  function getDeclension(n: number, one: string, few: string, many: string): string {
    n = Math.abs(n) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;

    return many;
  }

  if (!userData) {
    return <div />;
  }

  return (
    <main className="relative flex flex-col items-center rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(var(--nav-height)+1rem)] overflow-hidden mb-24">
      <section className="flex flex-col items-center gap-4 w-full mb-16">
        <div className="flex flex-col justify-center items-center">
          <img
            className="relative left-1"
            src={Rewards.src}
            alt="Награды"
            width={80}
            height={80}
          />
          <h1 className="text-gradient text-3xl font-black">
            {Number(userData.rating).toLocaleString()}
          </h1>
          <p className="text-black">@{userData.username}</p>
        </div>

        {!isUserPage && (
          <div>
            {userData.friendStatus === "FRIEND" && (
              <Button variant="destructive">Друзья</Button>
            )}
            {userData.friendStatus === "REQUESTED" && (
              <Button variant="destructive">Запрошено</Button>
            )}
            {userData.friendStatus === "WAITING" && (
              <Button
                variant="secondary"
                onClick={handleAcceptFriendRequest}
                isLoading={isLoadingAcceptFriend}
              >
                Принять
              </Button>
            )}
            {userData.friendStatus === "NOT_FRIEND" && (
              <Button
                variant="secondary"
                onClick={handleAddFriend}
                isLoading={isLoadingAddFriend}
              >
                Добавить в друзья
              </Button>
            )}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 mb-6">
        <Slider
          elements={achievementImages}
          onElementClick={handleAchievementClick}
        />
      </section>
      <section className="mb-6">
        <h1 className="text-black text-2xl text-left font-medium tracking-[-0.05em] mb-6">
          Выполнено{" "}
          <span className="text-gradient font-black">{userData.taskCount}</span>{" "}
          {getDeclension(userData.taskCount, "задание", "задания", "заданий")}{" "}
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

      <section className="video-slider flex flex-row gap-3 overflow-x-auto">
        {videoUrls.length > 0 &&
          videoUrls.map((el) => (
            <figure
              key={el}
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
                <source
                  src={`https://getquest.tech:8443/api/videos/download?fileId=${el}`}
                  type="video/mp4"
                />
                Ваш браузер не поддерживает видео.
              </video>
            </figure>
          ))}
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
