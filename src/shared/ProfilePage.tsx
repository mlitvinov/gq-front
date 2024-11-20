"use client";

import React, { useEffect, useState } from "react";
import Arrows from "@/app/_assets/arrows.png";
import Rewards from "@/app/_assets/rewards.png";
import { AchievementDrawer } from "@/app/profile/drawer";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/carousel";
import { Achievement, ChallengeData, Notification } from "@/types/entities";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { BASE_URL } from "@/lib/const";
import { api } from "@/lib/api";
import { FiBell } from "react-icons/fi";
import { LocaleSwitcher } from "@/components/LocaleSwitcher/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { NotificationsDrawer } from "@/notifications/NotificationsDrawer";

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

// Функция для разделения массива на верхний и нижний ряды
const splitArray = (array: any[]): { top: any[]; bottom: any[] } =>
  array.reduce(
    (acc, el, index) => {
      if (index % 2 === 0) {
        acc.top.push(el);
      } else {
        acc.bottom.push(el);
      }
      return acc;
    },
    { top: [], bottom: [] }
  );

// Функция для дополнения массива до нужной длины
const fillArray = (array: any[], length: number) => {
  const result = [...array];
  while (result.length < length) {
    result.push(null);
  }
  return result;
};

export default function ProfilePage({ params }: { params?: { id: number } }) {
  const t = useTranslations("profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [achievementImages, setAchievementImages] = useState<{ imageUrl: string; id: string }[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [challengeData, setChallengeData] = useState<ChallengeData[] | null>(null);
  const [isLoadingAddFriend, setIsLoadingAddFriend] = useState(false);
  const [isLoadingAcceptFriend, setIsLoadingAcceptFriend] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const initDataUser = useSignal(initData.user);

  const isUserPage = !params?.id || initDataUser?.username === userData?.username;

  // Получение количества непрочитанных уведомлений при загрузке страницы
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await api.get<{ unreadCount: number }>(`/api/notifications/count`);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("Ошибка при получении количества непрочитанных уведомлений:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const url = !isUserPage ? `/api/users/profile/?id=${params?.id}` : `/api/users/profile`;

        const data = await api.get<UserData>(url);

        setUserData(data);
        setAchievementImages(
          data.achievementListDTO.map((achievement: Achievement) => ({
            id: achievement.userAchievement!.toString(),
            imageUrl: `${BASE_URL}/api/images/${achievement.imageUrl}`,
          }))
        );
      } catch (error) {
        console.error("Ошибка при загрузке данных профиля:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const fetchVideoUrls = async () => {
      if (!userData) return;

      try {
        const data = await api.get<string[]>(`/api/challenges/user/video-urls?userId=${userData.id}`);

        setVideoUrls(data);
      } catch (error) {
        console.error("Ошибка при получении видео URL:", error);
      }
    };

    fetchVideoUrls();
  }, [userData]);

  // Загрузка полного списка уведомлений при открытии дровера
  const handleNotificationsClick = async () => {
    setIsNotificationsOpen(true);
    try {
      const data = await api.get<{ events: Notification[] }>(`/api/notifications`);
      setNotifications(data.events);
    } catch (error) {
      console.error("Ошибка при получении уведомлений:", error);
    }
  };

  // Обновление счётчика непрочитанных уведомлений после закрытия дровера
  const handleNotificationsClose = async () => {
    setIsNotificationsOpen(false);
    try {
      const data = await api.get<{ unreadCount: number }>(`/api/notifications/count`);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Ошибка при обновлении счётчика непрочитанных уведомлений:", error);
    }
  };

  const handleAchievementClick = async (id: string) => {
    const achievement = userData?.achievementListDTO.find((el) => el.userAchievement!.toString() === id);

    if (!achievement) return;

    setSelectedAchievement(achievement);

    try {
      const data = await api.get<ChallengeData[]>(`/api/challenges/achievement/${achievement.userAchievement}`);

      if (data.length > 0) {
        setChallengeData(data);
      }
    } catch (error) {
      console.error("Ошибка при получении данных задания:", error);
    }
  };

  const handleAddFriend = async () => {
    if (!userData) return;

    setIsLoadingAddFriend(true);
    try {
      await api.post(`/api/friends/request?receiverId=${userData.id}`);

      setUserData((prevData) => (prevData ? { ...prevData, friendStatus: "REQUESTED" } : prevData));
      setIsLoadingAddFriend(false);
    } catch (error) {
      console.error("Ошибка при отправке запроса в друзья:", error);
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
      await api.post(`/api/friends/accept/${userData.id}`);

      setUserData((prevData) => (prevData ? { ...prevData, friendStatus: "FRIEND" } : prevData));
      setIsLoadingAcceptFriend(false);
    } catch (error) {
      console.error("Ошибка при принятии запроса в друзья:", error);
      setIsLoadingAcceptFriend(false);
    }
  };

  const sliders = splitArray(fillArray(achievementImages, 12));

  if (!userData) {
    return <div />;
  }

  return (
    <main className="relative flex flex-col items-center rounded-t-[2rem] bg-white pt-8 pb-[calc(var(--nav-height)+1rem)] overflow-hidden mb-24">
      <div className="absolute top-4 right-4">
        <LocaleSwitcher />
      </div>
      {/* Иконка уведомлений в левом верхнем углу */}
      <div className="absolute text-gray-500 top-7 left-5">
        <button onClick={handleNotificationsClick} className="relative">
          <FiBell className="text-gray-500" size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <section className="flex flex-col items-center gap-4 w-full mb-8">
        <div className="flex flex-col justify-center items-center">
          <img className="relative left-1" src={Rewards.src} width={80} height={80} />
          <h1 className="text-gradient text-center text-3xl font-black">{Number(userData.rating).toLocaleString()}</h1>
          <p className="text-black">@{userData.username ? userData.username : userData.name}</p>
        </div>

        {!isUserPage && (
          <>
            {userData.friendStatus === "FRIEND" && <Button variant="destructive">{t("friend")}</Button>}
            {userData.friendStatus === "REQUESTED" && <Button variant="destructive">Запрошено</Button>}
            {userData.friendStatus === "WAITING" && (
              <Button variant="secondary" onClick={handleAcceptFriendRequest} isLoading={isLoadingAcceptFriend}>
                {t("accept")}
              </Button>
            )}
            {userData.friendStatus === "NOT_FRIEND" && (
              <Button variant="secondary" onClick={handleAddFriend} isLoading={isLoadingAddFriend}>
                {t("add-friend")}
              </Button>
            )}
          </>
        )}
      </section>

      {/* Карусели достижений */}
      <Carousel
        autoPlay
        containerClassName="[&>*:nth-child(odd)]:mt-2 select-none"
        options={{ loop: true, align: "center", dragFree: true }}
        items={sliders.top.map((el, index) =>
          el?.imageUrl ? (
            <div
              key={index}
              className="flex-shrink-0 size-16 rounded-xl bg-[#F6F6F6] px-1 mr-8 mb-4"
              onClick={() => handleAchievementClick(el.id)}
            >
              <img src={el.imageUrl} alt={`Логотип ${index + 1}`} className="size-16 object-contain cursor-pointer" />
            </div>
          ) : (
            <div key={index} className="size-16 px-4 mr-8 mb-4 rounded-xl bg-[#F6F6F6] select-none" />
          )
        )}
      />

      <Carousel
        autoPlay
        containerClassName="[&>*:nth-child(odd)]:mt-2 select-none"
        options={{ loop: true, align: "center", dragFree: true }}
        items={sliders.bottom.map((el, index) =>
          el?.imageUrl ? (
            <div
              key={index}
              className="flex-shrink-0 size-16 rounded-xl bg-[#F6F6F6] px-1 mr-8 mb-4"
              onClick={() => handleAchievementClick(el.id)}
            >
              <img src={el.imageUrl} alt={`Логотип ${index + 1}`} className="size-16 object-contain cursor-pointer" />
            </div>
          ) : (
            <div key={index} className="size-16 px-4 mr-8 mb-4 rounded-xl bg-[#F6F6F6] select-none" />
          )
        )}
      />

      {/* Раздел с количеством выполненных заданий и заработанным рейтингом */}
      <section className="mb-6">
        <h1 className="text-black text-2xl text-left font-medium tracking-[-0.05em] mb-2">
          {t("done")} <span className="text-gradient font-black">{userData.taskCount}</span>{" "}
          {t("task", { count: userData.taskCount })}{" "}
          <img className="inline -left-1 top-0 relative" src={Rewards.src} width={32} height={32} />
          <br />
          <img className="inline -left-1 relative" src={Arrows.src} width={32} height={32} />
          {t("earned")} <span className="text-gradient">{userData.earnedCount}</span> {t("reputations")}
        </h1>
      </section>

      {/* Карусель видео */}
      <Carousel
        autoPlay
        containerClassName="[&>*:nth-child(odd)]:mt-2 select-none"
        options={{ loop: true, align: "center", dragFree: true }}
        items={videoUrls.map((videoUrl) => (
          <div key={videoUrl} className="flex flex-col justify-center w-full px-4">
            <figure className="rounded-full overflow-hidden  size-64 bg-[#F6F6F6] flex items-center justify-center mr-6">
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
                <source src={`${BASE_URL}/api/videos/download?fileId=${videoUrl}`} type="video/mp4" />
                ERROR
              </video>
            </figure>
          </div>
        ))}
      />

      {/* Фиксированная навигация */}
      <nav className="fixed-nav fixed bottom-0 left-0 right-0 bg-white z-1000">
        <ul className="flex justify-around p-2">
          <li>Друзья</li>
          <li>Испытания</li>
          <li>Профиль</li>
        </ul>
      </nav>

      {/* Дровер с уведомлениями */}
      {isNotificationsOpen && (
        <NotificationsDrawer
          isOpen={isNotificationsOpen}
          onClose={handleNotificationsClose}
          notifications={notifications}
          unreadCount={unreadCount}
        />
      )}

      {/* Дровер с достижением */}
      {selectedAchievement && (
        <AchievementDrawer
          isOpen={!!selectedAchievement}
          onClose={() => {
            setSelectedAchievement(null);
            setChallengeData(null);
          }}
          achievement={selectedAchievement}
          challengeData={challengeData}
        />
      )}
    </main>
  );
}
