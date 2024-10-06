"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

import friends from "@/assets/friends.png";
import friendsA from "@/assets/friends-a.png";
import challenges from "@/assets/challenges.png";
import challengesA from "@/assets/challenges-a.png";
import profile from "@/assets/profile.png";
import profileA from "@/assets/profile-a.png";
import { usePathname } from "next/navigation";
import Link from "next/link";

const tabs = [
  {
    id: "friends",
    icon: friends,
    iconA: friendsA,
    label: "Friends",
    link: "/friends",
  },
  {
    id: "challenges",
    icon: challenges,
    iconA: challengesA,
    label: "Challenges",
    link: "/challenges",
  },
  {
    id: "profile",
    icon: profile,
    iconA: profileA,
    label: "Profile",
    link: "/profile",
  },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-[9999] inset-x-0 bg-white h-20">
      <ul className="flex gap-8 justify-between items-center h-full px-8">
        {tabs.map((tab) => {
          const isActive =
            pathname.split("/").slice(-1).pop() === tab.id.toString();

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
