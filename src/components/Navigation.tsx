"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

import friends from "@/assets/friends.png";
import friendsA from "@/assets/friends-a.png";
import challenges from "@/assets/challenges.png";
import challengesA from "@/assets/challenges-a.png";
import profile from "@/assets/profile.png";
import play from "@/assets/play.png";
import playA from "@/assets/play-a.png";
import profileA from "@/assets/profile-a.png";
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
    <nav className="fixed bottom-0 z-[9999] left-0 w-full bg-white h-[--nav-height] pb-[22px]">
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
