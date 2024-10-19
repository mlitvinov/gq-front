import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import Rewards from "@/assets/rewards.png";
import { Link } from "@/components/Link/Link";

type Achievement = {
  userAchievement: number;
  name: string;
  imageUrl: string;
};

type ChallengeData = {
  id: number;
  description: string;
  videoUrl: string | null;
  price: number;
  sender: string;
};

type AchievementDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement;
  challengeData: ChallengeData | null;
  initDataRaw: string;
};

export function AchievementDrawer({
                                    isOpen,
                                    onClose,
                                    achievement,
                                    challengeData,
                                    initDataRaw,
                                  }: AchievementDrawerProps) {
  const [videoSrc, setVideoSrc] = React.useState<string | null>(null);

  // Загружаем видео при наличии videoUrl
  React.useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    if (challengeData?.videoUrl) {
      const fetchVideo = async () => {
        try {
          const headers: HeadersInit = {
            accept: "*/*",
          };
          if (initDataRaw) {
            headers["initData"] = initDataRaw;
          }

          const response = await fetch(
            `https://getquest.tech:8443/api/videos/download?fileId=${challengeData.videoUrl}`,
            {
              method: "GET",
              headers,
            }
          );

          if (response.ok) {
            const blob = await response.blob();
            objectUrl = window.URL.createObjectURL(blob);
            if (isMounted) {
              setVideoSrc(objectUrl);
            }
          } else {
            console.error(
              `Ошибка при загрузке видео ${challengeData.videoUrl}:`,
              response.status
            );
          }
        } catch (error) {
          console.error("Ошибка при загрузке видео:", error);
        }
      };

      fetchVideo();
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [challengeData, initDataRaw]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        aria-describedby="achievement-description"
        aria-labelledby="achievement-title"
      >
        <div className="mx-auto w-full max-w-sm">
          {/* Карточка достижения */}
          <div className="flex flex-col border rounded-full border-[#fcf4f4] px-6 py-4">
            <div className="flex gap-2 items-center">
              <img
                src={`https://getquest.tech:8443/images/${achievement.imageUrl}`}
                alt={achievement.name}
                className="size-12 bg-[#F6F6F6] rounded-xl"
              />
              <div className="flex-grow">
                <div className="text-black font-semibold">{achievement.name}</div>
                {challengeData && (
                  <div className="text-gradient">
                    {challengeData.price}{" "}
                    <img
                      className="inline relative -top-0.5 -left-1"
                      src={Rewards.src}
                      alt="Награды"
                      height={18}
                      width={18}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Видео */}
          {videoSrc && (
            <div className="flex justify-center my-4">
              <video
                src={videoSrc}
                className="w-24 h-24 rounded-full object-cover"
                controls={false}
                muted
                playsInline
                autoPlay
                onClick={(e) => {
                  const video = e.currentTarget;
                  if (video.requestFullscreen) {
                    video.requestFullscreen();
                  } else if ((video as any).webkitEnterFullscreen) {
                    (video as any).webkitEnterFullscreen();
                  }
                  video.play();
                }}
              />
            </div>
          )}

          {/* Описание и отправитель */}
          {challengeData && (
            <>
              <DrawerHeader>
                <DrawerTitle id="achievement-title" className="text-xl font-bold">
                  {achievement.name}
                </DrawerTitle>
              </DrawerHeader>
              <DrawerDescription
                id="achievement-description"
                className="mt-4 mb-8 px-4 text-sm"
              >
                {challengeData.description}
                <br />
                <p className="text-sm text-gray-600">
                  Отправитель: <Link href={`/profile/${challengeData.sender.replace("@", "")}`} className="text-sm text-gray-600">{challengeData.sender}</Link>
                </p>
              </DrawerDescription>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
