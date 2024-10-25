import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { Link } from "@/components/Link/Link";


type ChallengeDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  achievementPicsUrl: string;
  achievementTitle: string;
  reputation: number;
  senderName: string;
  description: string;
  status: string;
  isSent: boolean;
  challengeId: number;
  initDataRaw: string;
  refreshChallenges: () => void;
  videoUrl?: string | null;
};

export function ChallengeDrawer({
                                  isOpen,
                                  onClose,
                                  achievementPicsUrl,
                                  achievementTitle,
                                  reputation,
                                  senderName,
                                  description,
                                  status,
                                  isSent,
                                  challengeId,
                                  initDataRaw,
                                  refreshChallenges,
                                  videoUrl,
                                }: ChallengeDrawerProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [videoResource, setVideoResource] = React.useState<{ videoUrl: string; fileId: string } | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    if (videoUrl) {
      const fetchVideoResource = async () => {
        try {
          const headers: HeadersInit = {
            accept: "*/*",
          };
          if (initDataRaw) {
            headers["initData"] = initDataRaw;
          }

          const response = await fetch(
            `https://getquest.tech:8443/api/videos/download?fileId=${videoUrl}`,
            {
              method: "GET",
              headers,
            }
          );

          if (response.ok) {
            const blob = await response.blob();
            const videoUrlObject = window.URL.createObjectURL(blob);
            if (isMounted) {
              setVideoResource({ videoUrl: videoUrlObject, fileId: videoUrl });
            }
          } else {
            console.error(`Ошибка при загрузке видео ${videoUrl}:`, response.status);
          }
        } catch (error) {
          console.error("Ошибка при загрузке видео:", error);
        }
      };

      fetchVideoResource();
    }

    return () => {
      isMounted = false;
      if (videoResource && videoResource.videoUrl) {
        window.URL.revokeObjectURL(videoResource.videoUrl);
      }
    };
  }, [videoUrl, initDataRaw]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Пожалуйста, выберите видеофайл.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `https://getquest.tech:8443/api/challenges/${challengeId}/complete`,
        {
          method: "PUT",
          headers: {
            accept: "*/*",
            initData: initDataRaw,
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Видео успешно загружено!");
        onClose();
        refreshChallenges();
      } else {
        console.error("Ошибка при загрузке видео", response.statusText);
        alert("Не удалось загрузить видео.");
      }
    } catch (error) {
      console.error("Произошла ошибка при загрузке видео:", error);
      alert("Произошла ошибка при загрузке видео.");
    }
  };

  const handleAccept = async () => {
    try {
      const response = await fetch(
        `https://getquest.tech:8443/api/challenges/${challengeId}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            initData: initDataRaw,
          },
        }
      );

      if (response.ok) {
        alert("Задание принято.");
        onClose();
        refreshChallenges();
      } else {
        console.error("Ошибка при принятии задания", response.statusText);
        alert("Не удалось принять задание.");
      }
    } catch (error) {
      console.error("Произошла ошибка при принятии задания:", error);
      alert("Произошла ошибка при принятии задания.");
    }
  };

  const handleDecline = async () => {
    try {
      const response = await fetch(
        `https://getquest.tech:8443/api/challenges/${challengeId}/decline`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            initData: initDataRaw,
          },
        }
      );

      if (response.ok) {
        alert("Задание отклонено.");
        onClose();
        refreshChallenges();
      } else {
        console.error("Ошибка при отклонении задания", response.statusText);
        alert("Не удалось отклонить задание.");
      }
    } catch (error) {
      console.error("Произошла ошибка при отклонении задания:", error);
      alert("Произошла ошибка при отклонении задания.");
    }
  };

  const handleApprove = async () => {
    const response = await fetch(
      `https://getquest.tech:8443/api/challenges/${challengeId}/approve`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          initData: initDataRaw,
        },
      }
    );

    if (response.ok) {
      alert("Задание подтверждено.");
      onClose();
      refreshChallenges();
    } else {
      console.error("Ошибка при подтверждении задания", response.statusText);
      alert("Не удалось подтвердить задание.");
    }
  };

  const handleDispute = async () => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите начать спор? В случае спора никто не получит свои средства назад."
    );
    if (!confirmed) return;

    const response = await fetch(
      `https://getquest.tech:8443/api/challenges/${challengeId}/dispute`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          initData: initDataRaw,
        },
      }
    );

    if (response.ok) {
      alert("Спор начат.");
      onClose();
      refreshChallenges();
    } else {
      console.error("Ошибка при начале спора", response.statusText);
      alert("Не удалось начать спор.");
    }
  };

  const shouldShowButtons = !isSent && !["APPROVE", "DECLINED", "DISPUTED"].includes(status);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        aria-describedby="challenge-description"
        aria-labelledby="challenge-title"
      >
        <div className="mx-auto w-full max-w-sm">
          <img
            src={`https://getquest.tech:8443/images/${achievementPicsUrl}`}
            alt={achievementTitle}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <DrawerHeader>
            <DrawerTitle id="challenge-title" className="text-xl font-bold">
              {achievementTitle}
            </DrawerTitle>
            <p className="text-lg text-gradient">{reputation} репутации</p>
            <Link href={`/profile/${senderName.replace("@", "")}`} className="text-sm text-gray-600">{senderName}</Link>
          </DrawerHeader>
          <DrawerDescription id="challenge-description" className="mt-4 mb-8 px-4 text-sm">
            {description}
          </DrawerDescription>

          {videoResource && (
            <div className="flex justify-center mb-4">
              <figure
                key={videoResource.fileId}
                className="rounded-full overflow-hidden w-24 h-24 bg-[#F6F6F6] flex items-center justify-center"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  className="w-full h-full object-cover rounded-full"
                  onClick={(e) => {
                    const video = e.currentTarget;
                    if (video.requestFullscreen) {
                      video.requestFullscreen();
                    } else if ((video as any).webkitEnterFullscreen) {
                      (video as any).webkitEnterFullscreen();
                    }
                    video.play();
                  }}
                >
                  <source src={videoResource.videoUrl} type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              </figure>
            </div>
          )}

          <DrawerFooter className="flex flex-col gap-2 px-4">
            {shouldShowButtons && status === "PENDING" && (
              <>
                <Button variant="secondary" onClick={handleAccept} className="w-full">
                  Принять
                </Button>
                <Button variant="outline" onClick={handleDecline} className="w-full">
                  Отказаться
                </Button>
              </>
            )}
            {status === "ACCEPTED" && !isSent && (
              <>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <Button variant="secondary" onClick={handleUpload} className="w-full">
                  Готово
                </Button>
                <Button variant="outline" onClick={handleDecline} className="w-full">
                  Отказаться
                </Button>
              </>
            )}
            {isSent && status === "COMPLETED" && (
              <>
                <Button variant="secondary" onClick={handleApprove} className="w-full">
                  Подтвердить
                </Button>
                <Button variant="outline" onClick={handleDispute} className="w-full">
                  Спор
                </Button>
              </>
            )}
            {status === "COMPLETED" && !isSent && (
              <Button onClick={handleDecline} variant="outline" className="w-full">
                Отказаться
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
