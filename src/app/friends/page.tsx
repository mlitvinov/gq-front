"use client";

import Scene from "@/components/canvas/scene";
import Gradient from "./gradient";
import { useEffect, useRef, useState } from "react";

import Messages from "@/assets/messages.png";
import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { DrawerExample } from "./drawer";

type User = {
  friendId: string;
  picsUrl: string;
  rating: number;
  username: string;
};

export default function FriendsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false); // Управление состоянием открытого окна
  const initDataRaw = useLaunchParams().initDataRaw;

  useEffect(() => {
    const getFriends = async () => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (initDataRaw) {
        headers["initData"] = initDataRaw;
      }

      const res = await fetch("https://getquest.tech:8443/api/users/friends", {
        method: "GET",
        headers,
      });
      const data = (await res.json()) as User[];
      console.log(data);
      setFriends(data);
    };

    getFriends();
  }, [initDataRaw]);

  return (
    <main className="relative flex flex-col ">
      <div
        ref={ref}
        className="bg-white h-48 overflow-hidden absolute inset-x-0 top-0 -z-10"
      >
        <Scene
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100%",
            pointerEvents: "none",
          }}
          eventSource={ref}
          eventPrefix="client"
        />
        <Gradient />
      </div>
      <div className="mt-40 rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(80px+1rem)]">
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
        <div className="flex flex-col gap-3">
          {friends.map((user) => (
            <div
              key={user.friendId}
              className="flex border rounded-full border-[#F6F6F6] px-6 py-4"
            >
              <div className="flex-grow">
                <div className="text-black font-semibold">{user.username}</div>
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
              <DrawerExample
                initDataRaw={initDataRaw}
                receiverId={user.friendId}
                onClose={() => setDrawerOpen(false)} // Закрытие окна через родительский компонент
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
