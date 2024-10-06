"use client";

import Scene from "@/components/canvas/scene";
import Gradient from "./gradient";
import { useEffect, useRef, useState } from "react";

import Messages from "@/assets/messages.png";
import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
import { useLaunchParams } from "@telegram-apps/sdk-react";

type User = {
  friendId: string;
  picsUrl: string;
  rating: number;
  username: string;
};

/* const mockFriends: User[] = [
  {
    name: "John Doe",
    reputation: 660,
  },
  {
    name: "Максим Литвинов",
    reputation: 660,
  },
]; */

export default function FriendsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const initDataRaw = useLaunchParams().initDataRaw;

  useEffect(() => {
    const getFriends = async () => {
      const res = await fetch("https://getquest.tech:8443/api/users/friends", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          initData: initDataRaw,
        },
      });
      const data = (await res.json()) as User[];
      console.log(data);
      setFriends(data);
    };

    getFriends();
  }, []);

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
          Пригласите друга{" "}
          <img
            className="inline -left-1 -top-1 relative"
            src={Messages.src}
            width={32}
            height={32}
          />
          <br />
          <img
            className="inline -left-1 relative"
            src={Arrows.src}
            width={32}
            height={32}
          />
          зарабатывайте <span className="text-gradient">репутацию</span>
        </h1>
        <div className="flex flex-col gap-3">
          {friends.map((user) => (
            <div
              key={user.friendId}
              className="flex border rounded-full border-[#F6F6F6] px-6 py-4"
            >
              <div>
                <div className="text-black font-semibold">{user.username}</div>
                <div className="text-gradient">
                  {user.rating}{" "}
                  <img
                    className="inline relative -top-0.5 -left-1"
                    src={Rewards.src}
                    height={18}
                    width={18}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
