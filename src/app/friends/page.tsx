"use client";

import React, { useEffect, useRef, useState } from "react";
import { initData } from "@telegram-apps/sdk-react";

import Messages from "@/app/_assets/messages.png";
import Arrows from "@/app/_assets/arrows.png";
import Rewards from "@/app/_assets/rewards.png";

import { Link } from "@/components/Link/Link";
import { cn } from "@/lib/utils";
import { SubmitQuestDrawer } from "./drawer";
import { PlusIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/const";
import { api } from "@/lib/api";
import { useTranslations } from "next-intl";
import { Friend, User } from "@/types/entities";

export default function FriendsPage() {
  const t = useTranslations("friends");

  const [friends, setFriends] = useState<User[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  const [loadingAcceptId, setLoadingAcceptId] = useState<number | null>(null);
  const [loadingDeclineId, setLoadingDeclineId] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  const getFriends = async () => {
    const data = await api.get<User[]>(`/api/users/friends`);

    setFriends(data);
  };

  const getRequests = async () => {
    const data = await api.get<Friend[]>(`/api/friends/requests`);

    setRequests(data);
  };

  const handleAccept = async (requestId: number) => {
    setLoadingAcceptId(requestId);

    try {
      await api.post(`/api/friends/accept?requestId=${requestId}`);

      setRequests((prev) => prev.filter((req) => req.id !== requestId));

      setLoadingAcceptId(null);
    } catch (error) {
      console.error(t("error-acceptance"), error);
    }
  };

  const handleDecline = async (requestId: number) => {
    setLoadingDeclineId(requestId);

    try {
      await api.post(`/api/friends/decline?requestId=${requestId}`);

      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error(t("error-rejection"), error);
    }
  };

  useEffect(() => {
    if (activeTab === "friends") {
      getFriends();
    } else if (activeTab === "requests") {
      getRequests();
    }
  }, [activeTab]);

  const copyReferralLink = () => {
    const _initData = initData.state();

    if (_initData && _initData.user) {
      const link = `https://t.me/CryptoMetaQuestBot?start=${_initData.user.id}`;
      navigator.clipboard.writeText(link).then(
        () => {
          alert(t("link-copy-success"));
        },
        (err) => {
          console.error(t("error-copy-text"), err);
        }
      );
    }
  };

  return (
    <main className="relative flex flex-col">
      <div ref={ref} className="bg-white h-48 overflow-hidden absolute inset-x-0 top-0 -z-10">
        <video loop autoPlay muted playsInline controls={false} preload="metadata" src="/gradient.webm" className="size-full pointer-events-none object-cover" />
      </div>
      <div className="mt-40 rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(var(--nav-height)+1rem)]">
        <h1 className="text-black text-2xl font-medium tracking-[-0.05em] mb-4">
          {t("invite-friends")} <img className="inline -left-1 -top-1 relative" src={Messages.src} width={32} height={32} />
          <br />
          <img className="inline -left-1 relative" src={Arrows.src}  width={32} height={32} />
          {t("earn")} <span className="text-gradient">{t("reputation")}</span>
        </h1>

        <Button onClick={copyReferralLink} className="w-full text-black bg-[#FEEF9E] mb-4">
          {t("link-copy")}
        </Button>

        <div className="flex mb-6">
          <button onClick={() => setActiveTab("friends")} className={cn("flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-l-full after:absolute font-medium text-center py-2", activeTab === "friends" && "text-black after:bg-[#FEEE9E]")}>
            {t("my-friends")}
          </button>
          <button onClick={() => setActiveTab("requests")} className={cn("flex-grow text-[#B1B1B1] relative after:content after:bottom-0 after:h-[2px] after:bg-[#F6F6F6] after:inset-x-0 after:rounded-r-full after:absolute font-medium text-center py-2", activeTab === "requests" && "text-black after:bg-[#FEEE9E]")}>
            {t("requests")}
          </button>
        </div>

        {activeTab === "friends" && (
          <div className="flex flex-col gap-3 mb-24">
            {friends.map((user) => (
              <Link key={user.friendId} href={`/profile/${user.friendId}`} className="flex border rounded-full border-[#F6F6F6] px-6 py-4">
                <div className="grow">
                  <p className="!text-black text-lg leading-tight font-semibold tracking-tight">{user.username}</p>
                  <div className="text-gradient">
                    {user.rating} <img className="inline relative -top-0.5 -left-1" src={Rewards.src}width={18} height={18} />
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <SubmitQuestDrawer username={user.username} receiverId={user.friendId} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="flex flex-col gap-3 mb-24">
            {requests.map((request) => (
              <div key={request.id} className="flex border rounded-full items-center border-[#F6F6F6] px-6 py-4">
                <Link href={`/profile/${request.senderId}`} className="flex-grow font-semibold text-black no-underline">
                  {request.senderName.replace("@", "")}
                </Link>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAccept(request.id);
                    }}
                    isLoading={loadingAcceptId === request.id}
                    disabled={loadingAcceptId === request.id}
                  >
                    <PlusIcon className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecline(request.id);
                    }}
                    isLoading={loadingDeclineId === request.id}
                    disabled={loadingDeclineId === request.id}
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
