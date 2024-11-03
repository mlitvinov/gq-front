"use client";

import React, { useEffect, useRef, useState } from "react";

import Messages from "@/assets/messages.png";
import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
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
  const initDataRaw = useLaunchParams().initDataRaw;

  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  const ref = useRef<HTMLDivElement>(null);

  const getFriends = async () => {
    if (!initDataRaw) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    const res = await fetch("https://getquest.tech:8443/api/users/friends", {
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
      "https://getquest.tech:8443/friends/requests/incoming",
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

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    const res = await fetch(
      `https://getquest.tech:8443/friends/accept?requestId=${requestId}`,
      {
        method: "POST",
        headers,
      }
    );

    if (!res.ok) {
      console.error("Ошибка при загрузке друзей");
      return;
    }

    setRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  const handleDecline = async (requestId: number) => {
    if (!initDataRaw) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    const res = await fetch(
      `https://getquest.tech:8443/friends/decline?requestId=${requestId}`,
      {
        method: "POST",
        headers,
      }
    );

    if (!res.ok) {
      console.error("Ошибка при загрузке друзей");
      return;
    }

    setRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  return (
    <main className="relative flex flex-col ">
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
        <h1 className="text-black text-2xl font-medium tracking-[-0.05em] mb-6">
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

        {/* Табы */}
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

        {/* Контент в зависимости от выбранного таба */}
        {activeTab === "friends" && (
          <div className="flex flex-col gap-3 mb-24">
            {friends.map((user) => (
              <Link
                key={user.friendId}
                href={`/profile/${user.username.replace("@", "")}`}
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
                    //  onClose={() => setDrawerOpen(false)}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="flex flex-col gap-3 mb-24">
            {requests.map((request) => (
              <Link
                key={request.id}
                href={`/profile/${request.senderName.replace("@", "")}`}
                className="flex border rounded-full items-center border-[#F6F6F6] px-6 py-4"
              >
                <p className="flex-grow text-black font-semibold">
                  {request.senderName.replace("@", "")}
                </p>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2"
                >
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(request.id);
                    }}
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecline(request.id);
                    }}
                  >
                    <XMarkIcon className="size-4" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
