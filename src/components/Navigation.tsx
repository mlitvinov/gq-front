"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

import friends from "@/app/_assets/friends.png";
import friendsA from "@/app/_assets/friends-a.png";
import challenges from "@/app/_assets/challenges.png";
import challengesA from "@/app/_assets/challenges-a.png";
import profile from "@/app/_assets/profile.png";
import play from "@/app/_assets/play.png";
import playA from "@/app/_assets/play-a.png";
import profileA from "@/app/_assets/profile-a.png";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { hapticFeedback } from "@telegram-apps/sdk-react";

const Navigation = () => {
  const t = useTranslations("navigation");

  const pathname = usePathname();

  const tabs = [
    {
      id: "recommendations",
      icon: play,
      iconA: playA,
      label: t("recommendations"),
      link: "/recommendations",
    },
    {
      id: "friends",
      icon: friends,
      iconA: friendsA,
      label: t("friends"),
      link: "/friends",
    },
    {
      id: "challenges",
      icon: challenges,
      iconA: challengesA,
      label: t("challenges"),
      link: "/challenges",
    },
    {
      id: "profile",
      icon: profile,
      iconA: profileA,
      label: t("profile"),
      link: "/profile",
    },
  ];

  const handleMakeImpact = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred("heavy");
    }
  };

  return (
    <nav className="fixed bottom-0 z-[9999] left-0 w-full bg-white h-[--nav-height] pb-[22px]">
      <ul className="flex gap-4 justify-between items-center h-full px-4">
        {tabs.map((tab) => {
          const isActive = pathname?.split("/").slice(-1).pop() === tab.id.toString();

          return (
            <li key={tab.label}>
              <Link className={cn(buttonVariants({ variant: "default" }), "flex-col h-[58px]", isActive && "bg-[#F6F6F6]")} onMouseDown={handleMakeImpact} href={tab.link}>
                <img src={isActive ? tab.iconA.src : tab.icon.src} height={32} width={32} alt={`${tab.label} section button`} />
                <span className="text-[0.625rem] text-black font-medium tracking-[-0.075em]">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
