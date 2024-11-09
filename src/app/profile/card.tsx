import React from "react";
import Rewards from "@/assets/rewards.png";
import { Button } from "@/components/ui/button";

type ChallengeCardProps = {
  achievementPicsUrl: string;
  achievementTitle: string;
  price: number;
  status?: string;
  onClick?: () => void;
  hideChallenge?: () => void;
};

const getStatusBars = (status: string) => {
  let bars = 1;
  let color = "#FEEE9E";

  switch (status) {
    case "PENDING":
      bars = 1;
      break;
    case "ACCEPTED":
      bars = 2;
      break;
    case "COMPLETED":
      bars = 3;
      break;
    case "APPROVE":
      bars = 4;
      color = "#4CAF50";
      break;
    case "DISPUTED":
      bars = 4;
      color = "#F44336";
      break;
    case "DECLINED":
      bars = 1;
      color = "#F44336";
      break;
  }

  return { bars, color };
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
                                                              achievementPicsUrl,
                                                              achievementTitle,
                                                              price,
                                                              status = "APPROVE",
                                                              onClick,
                                                              hideChallenge,
                                                            }) => {
  const { bars, color } = getStatusBars(status);

  return (
    <div
      className="flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4"
      onClick={onClick}
    >
      <div className="flex gap-2 items-center">
        <img
          src={`https://getquest.tech:6443/api/images/${achievementPicsUrl}`}
          alt={achievementTitle}
          className="size-12 bg-[#F6F6F6] rounded-xl"
        />
        <div className="flex-grow">
          <div className="text-black font-semibold">{achievementTitle}</div>
          <div className="text-gradient">
            {price}{" "}
            <img
              className="inline relative -top-0.5 -left-1"
              src={Rewards.src}
              alt="Награды"
              height={18}
              width={18}
            />
          </div>
        </div>
        {hideChallenge && (
          <Button variant="ghost" onClick={hideChallenge}>
            ✖
          </Button>
        )}
      </div>

      <div className="flex gap-[10px] mt-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <figure
            key={index}
            className="h-[5px] grow rounded-full"
            style={{ backgroundColor: index < bars ? color : "#F6F6F6" }}
          />
        ))}
      </div>
    </div>
  );
};
