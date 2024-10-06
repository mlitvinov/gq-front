"use client";

import { useRef } from "react";

import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
import Slider from "./slider";
import { element } from "three/webgpu";

const elements = [
  "https://example.com/logo1.png",
  "https://example.com/logo2.png",
  "https://example.com/logo3.png",
  "https://example.com/logo1.png",
  "https://example.com/logo2.png",
  "https://example.com/logo3.png",
  "https://example.com/logo1.png",
  "https://example.com/logo2.png",
  "https://example.com/logo3.png",
  "https://example.com/logo1.png",
  "https://example.com/logo2.png",
  "https://example.com/logo3.png",
  "https://example.com/logo1.png",
  "https://example.com/logo2.png",
  "https://example.com/logo3.png",
  // Add more logo URLs here
];

export default function ProfilePage() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <main className="relative flex flex-col items-center rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(80px+1rem)]">
      <section className="flex flex-col justify-center items-center mb-16">
        <img
          className="relative left-1"
          src={Rewards.src}
          width={80}
          height={80}
        />
        <h1 className="text-gradient text-3xl font-black">12 000</h1>
        <p className="text-black">@maks</p>
      </section>
      <section className="flex flex-col gap-3 mb-6">
        <Slider elements={elements} />
      </section>
      <section className="mb-6">
        <h1 className="text-black text-2xl text-left font-medium tracking-[-0.05em] mb-6">
          Completed <span className="text-gradient font-black">12</span> tasks{" "}
          <img
            className="inline -left-1 top-0 relative"
            src={Rewards.src}
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
          earn <span className="text-gradient">12 000</span> reputation in total
        </h1>
      </section>
      <section className="flex flex-col gap-3 overflow-hidden">
        <figure className="size-64 rounded-full bg-[#F6F6F6]" />
      </section>
    </main>
  );
}
