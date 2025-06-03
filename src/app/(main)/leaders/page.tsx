"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { Link } from "@/components/Link/Link";
import Rewards from "@/app/_assets/rewards.png";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface Leader {
  id: number;
  name: string;
  rating: number;
  you: boolean;
}

export default function LeadersPage() {
  const t = useTranslations("leaders");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Leader[]>("/api/users/leaderboard");
        setLeaders(data);
      } catch (err) {
        console.error("Failed to fetch leaders", err);
      }
    })();
  }, []);

  return (
    <main className="relative flex flex-col">
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
          className="size-full pointer-events-none object-cover"
        >
          <source src="/gradient.webm" type="video/webm" />
          <source src="/gradient.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="mt-40 rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(var(--nav-height)+1rem)]">
        <h1 className="text-black text-2xl font-medium tracking-[-0.05em] mb-4">
          {t("title")}
        </h1>
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full text-left">
            <tbody>
              {leaders.map((leader) => (
                <tr key={leader.id} className="border-b last:border-b-0">
                  <td className="py-2">
                    <Link
                      href={`/profile/${leader.id}`}
                      className={cn("text-black", leader.you && "font-bold")}
                    >
                      {leader.name}
                    </Link>
                  </td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <span className="text-gradient">
                      {leader.rating}
                      <img
                        className="inline relative -top-0.5 -left-1"
                        src={Rewards.src}
                        width={18}
                        height={18}
                        alt="rewards"
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
