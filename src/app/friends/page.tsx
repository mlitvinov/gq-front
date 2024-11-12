"use client";

import React, { useEffect, useRef, useState } from "react";
import Messages from "@/assets/messages.png";
import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
import { useInitData } from "@telegram-apps/sdk-react";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { Link } from "@/components/Link/Link";
import { cn } from "@/lib/utils";
import { SubmitQuestDrawer } from "./drawer";
import { PlusIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/ui/button";

type User = {
  friendId: string;
  picsUrl: string;
  rating: number;
  username: string;
  userId: string;
};

type FriendRequest = {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  status: string;
  createdAt: string;
};

export default function FriendsPage() {
  const initData = useInitData();
  const initDataRaw = useLaunchParams().initDataRaw;

  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  const [loadingAcceptId, setLoadingAcceptId] = useState<number | null>(null);
  const [loadingDeclineId, setLoadingDeclineId] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const getFriends = async () => {
    if (!initDataRaw) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    const res = await fetch("https://walrus-app-gofux.ondigitalocean.app/api/users/friends", {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      console.error("Ошибка при загрузке друзей");
      return;
    }

    const data = (await res.json()) as User[];
    setFriends(data);
  };

  const getRequests = async () => {
    if (!initDataRaw) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    const res = await fetch(
      "https://walrus-app-gofux.ondigitalocean.app/friends/requests/incoming",
      {
        method: "GET",
        headers,
      }
    );

    if (!res.ok) {
      console.error("Ошибка при загрузке запроса");
      return;
    }

    const data = (await res.json()) as FriendRequest[];
    setRequests(data);
  };

  useEffect(() => {
    if (activeTab === "friends") {
      getFriends();
    } else if (activeTab === "requests") {
      getRequests();
    }
  }, [initDataRaw, activeTab]);

  const handleAccept = async (requestId: number) => {
    if (!initDataRaw) return;

    setLoadingAcceptId(requestId); // Установка состояния загрузки для Accept

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    try {
      const res = await fetch(
        `https://walrus-app-gofux.ondigitalocean.app/friends/accept?requestId=${requestId}`,
        {
          method: "POST",
          headers,
        }
      );

      if (!res.ok) {
        console.error("Ошибка при принятии запроса");
        return;
      }

      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Произошла ошибка при принятии запроса:", error);
    } finally {
      setLoadingAcceptId(null); // Сброс состояния загрузки для Accept
    }
  };

  const handleDecline = async (requestId: number) => {
    if (!initDataRaw) return;

    setLoadingDeclineId(requestId); // Установка состояния загрузки для Decline

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    try {
      const res = await fetch(
        `https://walrus-app-gofux.ondigitalocean.app/friends/decline?requestId=${requestId}`,
        {
          method: "POST",
          headers,
        }
      );

      if (!res.ok) {
        console.error("Ошибка при отклонении запроса");
        return;
      }

      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Произошла ошибка при отклонении запроса:", error);
    } finally {
      setLoadingDeclineId(null); // Сброс состояния загрузки для Decline
    }
  };

  const copyReferralLink = () => {
    if (!initData?.user) {
      console.error("Данные пользователя недоступны");
      return;
    }
    const link = `https://t.me/CryptoMetaQuestBot?start=${initData.user.id}`;
    navigator.clipboard.writeText(link).then(
      () => {
        alert("Ссылка скопирована в буфер обмена");
      },
      (err) => {
        console.error("Не удалось скопировать текст: ", err);
      }
    );
  };

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
        <h1 className="text-black text-2xl font-medium tracking-[-0.05em] mb-4">
          Приглашай друзей{" "}
          <img
            className="inline -left-1 -top-1 relative"
            src={Messages.src}
            alt="Сообщения"
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
          зарабатывай <span className="text-gradient">репутацию</span>
        </h1>

        <Button
          onClick={copyReferralLink}
          className="w-full mb-4"
          style={{ backgroundColor: "#FEEF9E", color: "black" }}
        >
          Скопировать реферальную ссылку
        </Button>

        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("friends")}
            className={cn(
              "flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2",
              activeTab === "friends" && "text-black after:bg-[#FEEE9E]"
            )}
          >
            Мои друзья
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-r-full after:absolute font-medium text-center py-2",
              activeTab === "requests" && "text-black after:bg-[#FEEE9E]"
            )}
          >
            Запросы
          </button>
        </div>

        {activeTab === "friends" && (
          <div className="flex flex-col gap-3 mb-24">
            {friends.map((user) => (
              <Link
                key={user.friendId}
                href={`/profile/${user.friendId}`}
                className="flex border rounded-full border-[#F6F6F6] px-6 py-4"
              >
                <div className="grow">
                  <p className="!text-black text-lg leading-tight font-semibold tracking-tight">
                    {user.username}
                  </p>
                  <div className="text-gradient">
                    {user.rating}{" "}
                    <img
                      className="inline relative -top-0.5 -left-1"
                      src={Rewards.src}
                      alt="Награды"
                      width={18}
                      height={18}
                    />
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <SubmitQuestDrawer
                    username={user.username}
                    initDataRaw={initDataRaw}
                    receiverId={user.friendId}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="flex flex-col gap-3 mb-24">
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex border rounded-full items-center border-[#F6F6F6] px-6 py-4"
              >
                <Link
                  href={`/profile/${request.senderId}`}
                  className="flex-grow font-semibold text-black no-underline"
                >
                  {request.senderName.replace("@", "")}
                </Link>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAccept(request.id);
                    }}
                    isLoading={loadingAcceptId === request.id} // Индикатор загрузки для Accept
                    disabled={loadingAcceptId === request.id} // Отключение кнопки во время загрузки
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecline(request.id);
                    }}
                    isLoading={loadingDeclineId === request.id} // Индикатор загрузки для Decline
                    disabled={loadingDeclineId === request.id} // Отключение кнопки во время загрузки
                  >
                    <XMarkIcon className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
