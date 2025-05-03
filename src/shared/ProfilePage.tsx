"use client";

import React, { useEffect, useState } from "react";
import Arrows from "@/app/_assets/arrows.png";
import Rewards from "@/app/_assets/rewards.png";
import Question from "@/app/_assets/box.png";
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

const splitArray = <T,>(array: T[]): { top: T[]; bottom: T[] } =>
  array.reduce(
    (acc, el, index) => {
      if (index % 2 === 0) {
        acc.top.push(el);
      } else {
        acc.bottom.push(el);
      }
      return acc;
    },
    { top: [] as T[], bottom: [] as T[] }
  );

// Дополняем массив нулями (null) до нужной длины, чтобы ячеек в карусели
// всегда было одинаковое количество
const fillArray = <T,>(array: T[], length: number) => {
  const result = [...array];
  while (result.length < length) {
    result.push(null as T);
  }
  return result;
};

export default function ProfilePage({ params }: { params?: { id: number } }) {
  const t = useTranslations("profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [achievementImages, setAchievementImages] = useState<{ imageUrl: string | null; id: string | null }[]>([]);
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
    (async () => {
      try {
        const { unreadCount } = await api.get<{ unreadCount: number }>("/api/notifications/count");
        setUnreadCount(unreadCount);
      } catch (err) {
        console.error("Ошибка при получении количества непрочитанных уведомлений:", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const url = !isUserPage ? `/api/users/profile/?id=${params?.id}` : "/api/users/profile";
        const data = await api.get<UserData>(url);

        setUserData(data);
        setAchievementImages(
          data.achievementListDTO.map((a) => ({
            id: a.userAchievement?.toString() ?? null,
            imageUrl: a.imageUrl ? `${BASE_URL}/api/images/${a.imageUrl}` : null,
          }))
        );
      } catch (err) {
        console.error("Ошибка при загрузке данных профиля:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!userData) return;
    (async () => {
      try {
        const urls = await api.get<string[]>(`/api/challenges/user/video-urls?userId=${userData.id}`);
        setVideoUrls(urls);
      } catch (err) {
        console.error("Ошибка при получении видео URL:", err);
      }
    })();
  }, [userData]);

  // Загрузка полного списка уведомлений при открытии дровера
  const handleNotificationsClick = async () => {
    setIsNotificationsOpen(true);
    try {
      const { events } = await api.get<{ events: Notification[] }>("/api/notifications");
      setNotifications(events);
    } catch (err) {
      console.error("Ошибка при получении уведомлений:", err);
    }
  };

  // Обновление счётчика непрочитанных уведомлений после закрытия дровера
  const handleNotificationsClose = async () => {
    setIsNotificationsOpen(false);
    try {
      const { unreadCount } = await api.get<{ unreadCount: number }>("/api/notifications/count");
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Ошибка при обновлении счётчика непрочитанных уведомлений:", err);
    }
  };

   const handleAchievementClick = async (id: string | null) => {
    if (!id || !userData) return;
    const achievement = userData.achievementListDTO.find((el) => el.userAchievement?.toString() === id);
    if (!achievement) return;

    setSelectedAchievement(achievement);

    try {
      const data = await api.get<ChallengeData[]>(`/api/challenges/achievement/${achievement.userAchievement}?userId=${userData.id}`);
      if (data.length > 0) setChallengeData(data);
    } catch (err) {
      console.error("Ошибка при получении данных задания:", err);
    }
  };

  const handleAddFriend = async () => {
    if (!userData) return;

    setIsLoadingAddFriend(true);
    try {
      await api.post(`/api/friends/request?receiverId=${userData.id}`);

      setUserData((prev) => (prev ? { ...prev, friendStatus: "REQUESTED" } : prev));
    } catch (err) {
      console.error("Ошибка при отправке запроса в друзья:", err);
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
      await api.post(`/api/friends/accept/${userData.id}`);

      setUserData((prev) => (prev ? { ...prev, friendStatus: "FRIEND" } : prev));
    } catch (err) {
      console.error("Ошибка при принятии запроса в друзья:", err);
    } finally {
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
          <FiBell size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">{unreadCount}</span>
          )}
        </button>
      </div>

      <section className="flex flex-col items-center gap-4 w-full mb-8">
        <div className="flex flex-col justify-center items-center">
          <img src={Rewards.src} width={80} height={80} className="relative left-1" alt="rewards" />
          <h1 className="text-gradient text-center text-3xl font-black">{Number(userData.rating).toLocaleString()}</h1>
          <p className="text-black">@{userData.username || userData.name}</p>
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
        items={sliders.top.map((el, idx) => (
          <div
            key={`a-top-${idx}`}
            className="flex-shrink-0 size-16 rounded-xl bg-[#F6F6F6] px-1 mr-8 mb-4 flex items-center justify-center"
            onClick={() => handleAchievementClick(el?.id ?? null)}
          >
            <img
              src={el?.imageUrl ?? Question.src}
              alt={el?.imageUrl ? `Достижение ${idx + 1}` : "Достижение скрыто"}
              className="size-16 object-contain cursor-pointer"
            />
          </div>
        ))}
      />

      <Carousel
        autoPlay
        containerClassName="[&>*:nth-child(odd)]:mt-2 select-none"
        options={{ loop: true, align: "center", dragFree: true }}
        items={sliders.bottom.map((el, idx) => (
          <div
            key={`a-bot-${idx}`}
            className="flex-shrink-0 size-16 rounded-xl bg-[#F6F6F6] px-1 mr-8 mb-4 flex items-center justify-center"
            onClick={() => handleAchievementClick(el?.id ?? null)}
          >
            <img
              src={el?.imageUrl ?? Question.src}
              alt={el?.imageUrl ? `Достижение ${idx + 7}` : "hidden"}
              className="size-16 object-contain cursor-pointer"
            />
          </div>
        ))}
      />

      {/* Раздел с количеством выполненных заданий и заработанным рейтингом */}
      <section className="mb-6">
        <h1 className="text-black text-2xl font-medium tracking-[-0.05em] mb-2">
          {t("done")}{" "}
          <span className="text-gradient font-black">{userData.taskCount}</span>{" "}
          {t("task", { count: userData.taskCount })}{" "}
          <img src={Rewards.src} width={32} height={32} alt="rewards" className="inline relative -left-1 top-0" />
          <br />
          <img src={Arrows.src} width={32} height={32} alt="arrows" className="inline relative -left-1" />
          {t("earned")} <span className="text-gradient">{userData.earnedCount}</span> {t("reputations")}
        </h1>
      </section>

      {/*/!* Карусель видео *!/*/}
      {/*<Carousel*/}
      {/*  autoPlay*/}
      {/*  containerClassName="[&>*:nth-child(odd)]:mt-2 select-none"*/}
      {/*  options={{ loop: true, align: "center", dragFree: true }}*/}
      {/*  items={videoUrls.map((url) => (*/}
      {/*    <div key={url} className="flex flex-col justify-center w-full px-4">*/}
      {/*      <figure className="rounded-full overflow-hidden size-64 bg-[#F6F6F6] flex items-center justify-center mr-6">*/}
      {/*        <video*/}
      {/*          autoPlay*/}
      {/*          loop*/}
      {/*          muted*/}
      {/*          playsInline*/}
      {/*          controls={false}*/}
      {/*          className="w-full h-full object-cover rounded-full"*/}
      {/*          onClick={(e) => {*/}
      {/*            const v = e.currentTarget;*/}
      {/*            if (v.requestFullscreen) v.requestFullscreen();*/}
      {/*            else if ((v as any).webkitEnterFullscreen) (v as any).webkitEnterFullscreen();*/}
      {/*            v.play();*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <source src={`${BASE_URL}/api/videos/download?fileId=${url}`} type="video/mp4" />*/}
      {/*        </video>*/}
      {/*      </figure>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*/>*/}

      {/* Фиксированная навигация */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white z-1000">
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
          isOpen={Boolean(selectedAchievement)}
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
