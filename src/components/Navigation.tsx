"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

import friends from "@/assets/friends.avif";
import friendsA from "@/assets/friends-a.avif";
import challenges from "@/assets/challenges.avif";
import challengesA from "@/assets/challenges-a.avif";
import profile from "@/assets/profile.avif";
import play from "@/assets/play.avif";
import playA from "@/assets/play-a.avif";
import profileA from "@/assets/profile-a.avif";
import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    id: "recommendations",
    icon: play,
    iconA: playA,
    label: "Рекомендации",
    link: "/recommendations",
  },
  {
    id: "friends",
    icon: friends,
    iconA: friendsA,
    label: "Друзья",
    link: "/friends",
  },
  {
    id: "challenges",
    icon: challenges,
    iconA: challengesA,
    label: "Испытания",
    link: "/challenges",
  },
  {
    id: "profile",
    icon: profile,
    iconA: profileA,
    label: "Профиль",
    link: "/profile",
  },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed grid bottom-[10px] grid-cols-4 items-center w-full z-[9999] left-0 right-0 bg-white h-[calc(15vh-20px)] max-h-[76px]">
      <ul className="flex gap-4 justify-between items-center h-full px-4">
        {tabs.map((tab) => {
          const isActive =
            pathname?.split("/").slice(-1).pop() === tab.id.toString();

          return (
            <li key={tab.label}>
              <Link
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "flex-col h-[58px]",
                  isActive && "bg-[#F6F6F6]"
                )}
                href={tab.link}
              >
                <img
                  src={isActive ? tab.iconA.src : tab.icon.src}
                  height={32}
                  width={32}
                  alt={`${tab.label} section button`}
                />
                <span className="text-[0.625rem] text-black font-medium tracking-[-0.075em]">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
        {/* <li>
          <a
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex-col h-[58px] bg-[#F6F6F6]"
            )}
            href="/"
          >
            <img
              src={friendsA.src}
              height={32}
              width={32}
              alt="Friends section button"
            />
            <span className="text-[0.625rem] text-black font-medium tracking-[-0.075em]">
              Friends
            </span>
          </a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navigation;
