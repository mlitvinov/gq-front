"use client";

import Scene from "@/components/canvas/scene";
import Gradient from "./gradient";
import { useRef } from "react";

import Messages from "@/assets/messages.png";
import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
import Image from "next/image";

const mockChallenges = [
  {
    label: "Кук Мастер",
    reputation: 660,
  },
  {
    label: "Геймер",
    reputation: 660,
  },
];

export default function ChallengesPage() {
  const ref = useRef<HTMLDivElement>(null);

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
          Complete tasks{" "}
          <Image
            className="inline -left-1 -top-1 relative"
            src={Rewards.src}
            alt="Награды"
            width={32}
            height={32}
          />
          <br />
          <Image
            className="inline -left-1 relative"
            src={Arrows.src}
            alt="Стрелки"
            width={32}
            height={32}
          />
          earn <span className="text-gradient">reputation</span>
        </h1>
        <div className="flex flex-col gap-3">
          {mockChallenges.map((challenge) => (
            <div
              key={challenge.label} // Добавлен ключ
              className="flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4"
            >
              <div className="flex gap-2">
                <figure className="size-12 bg-[#F6F6F6] rounded-xl" />
                <div>
                  <div className="text-black font-semibold">
                    {challenge.label}
                  </div>
                  <div className="text-gradient">
                    {challenge.reputation}{" "}
                    <Image
                      className="inline relative -top-0.5 -left-1"
                      src={Rewards.src}
                      alt="Награды"
                      height={18}
                      width={18}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-[10px] mt-2">
                <figure className="h-[5px] grow bg-[#FEEE9E] rounded-full" />
                <figure className="h-[5px] grow bg-[#F6F6F6] rounded-full" />
                <figure className="h-[5px] grow bg-[#F6F6F6] rounded-full" />
                <figure className="h-[5px] grow bg-[#F6F6F6] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
