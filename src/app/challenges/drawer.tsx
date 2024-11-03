"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Link } from "@/components/Link/Link";
import Rewards from "@/assets/rewards.png";
import { Progress } from "@/components/ui/progress";
import { BASE_URL } from "@/lib/const";

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
  refreshChallenges: () => Promise<void>;
  fieldId?: string | null;
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
  fieldId,
}: ChallengeDrawerProps) {
  const [progress, setProgress] = React.useState<number>(0);
  // const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleApproveSubmit = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = (selectedFile: File) => {
    if (!selectedFile) {
      alert("Пожалуйста, выберите видеофайл.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();

    xhr.open(
      "PUT",
      `https://getquest.tech:8443/api/challenges/${challengeId}/complete`,
      true
    );

    xhr.setRequestHeader("accept", "*/*");
    xhr.setRequestHeader("initData", initDataRaw);

    // xhr.withCredentials = true;

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setProgress(progress);
      }
      if (event.loaded === event.total) {
        setProgress(100);
      }
    });

    xhr.addEventListener("loadend", () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        alert("Видео успешно загружено!");
        onClose();
        refreshChallenges();
      } else {
        console.error("Ошибка при загрузке видео");
        alert("Не удалось загрузить видео.");
      }
    });

    xhr.onerror = () => {
      console.log("xhr.onerror", xhr);
      console.error("Ошибка при загрузке видео");
      alert("Не удалось загрузить видео.");
      // elf.postMessage({ success: false, error: "Failed to upload file." });
    };

    xhr.send(formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // setSelectedFile(event.target.files[0]);
      handleUpload(event.target.files[0]);
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
      await refreshChallenges();
      onClose();
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
      await refreshChallenges();
      onClose();
    } else {
      console.error("Ошибка при начале спора", response.statusText);
      alert("Не удалось начать спор.");
    }
  };

  const hideChallenge = async (id: number) => {
    if (!initDataRaw) return;

    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить это задание у себя из истории?"
    );

    if (!confirmed) return;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      initData: initDataRaw,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/challenges/${id}/hide`, {
        method: "PUT",
        headers,
      });

      if (!response.ok) {
        console.error("Ошибка при удалении задания:", response.statusText);
        return;
      }

      await refreshChallenges();
      onClose();
    } catch (error) {
      console.error("Произошла ошибка при удалении задания:", error);
    }
  };

  const shouldShowButtons =
    !isSent && !["APPROVE", "DECLINED", "DISPUTED"].includes(status);

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
            className="w-full h-40 aspect-square object-contain select-none pointer-events-none rounded-md mb-4"
          />
          <DrawerHeader>
            <DrawerTitle id="challenge-title" className="text-xl font-bold">
              {achievementTitle}
            </DrawerTitle>
            <Link
              href={`/profile/${senderName.replace("@", "")}`}
              className="text-sm text-gray-600 mb-4"
            >
              {senderName}
            </Link>

            <p className="text-3xl text-gradient ml-4 font-black">
              <span className="mr-1">{reputation}</span>
              <img
                className="inline relative -top-0.5"
                src={Rewards.src}
                alt="Награды"
                height={32}
                width={32}
              />
            </p>
          </DrawerHeader>
          <DrawerDescription
            id="challenge-description"
            className="mt-4 mb-8 px-4 text-center font-medium text-sm"
          >
            {description}
          </DrawerDescription>

          {fieldId && (
            <div className="flex justify-center mb-4">
              <figure className="rounded-full overflow-hidden w-24 h-24 bg-[#F6F6F6] flex items-center justify-center">
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
                  <source
                    src={`https://getquest.tech:8443/api/videos/download?fileId=${fieldId}`}
                    type="video/mp4"
                  />
                  Ваш браузер не поддерживает видео.
                </video>
              </figure>
            </div>
          )}

          <DrawerFooter className="flex flex-col gap-2 px-4">
            {shouldShowButtons && status === "PENDING" && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleAccept}
                  className="w-full"
                >
                  Принять
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  className="w-full"
                >
                  Отказаться
                </Button>
              </>
            )}
            {status === "ACCEPTED" && !isSent && (
              <>
                <input
                  ref={fileInputRef}
                  placeholder="Выберите файл"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {progress > 0 ? (
                  <Progress className="w-full h-1" value={progress} />
                ) : (
                  <>
                    {" "}
                    <Button
                      variant="secondary"
                      onClick={handleApproveSubmit}
                      className="w-full"
                    >
                      Загрузить подтверждение
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDecline}
                      className="w-full"
                    >
                      Отказаться
                    </Button>
                  </>
                )}
              </>
            )}
            {isSent && status === "COMPLETED" && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleApprove}
                  className="w-full"
                >
                  Подтвердить
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDispute}
                  className="w-full"
                >
                  Спор
                </Button>
              </>
            )}
            {status === "COMPLETED" && !isSent && (
              <Button
                onClick={handleDecline}
                variant="outline"
                className="w-full"
              >
                Отказаться
              </Button>
            )}
            {(status === "DISPUTED" ||
              status === "DECLINED" ||
              status === "APPROVE") && (
              <Button
                variant="ghost"
                className="text-red-700 bg-red-100/50"
                onClick={() => hideChallenge(challengeId)}
              >
                Скрыть
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
