"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { Link } from "@/components/Link/Link";
import Rewards from "@/assets/rewards.png";
import { Progress } from "@/components/ui/progress";
import { BASE_URL } from "@/lib/const";
import Drawer from "@/components/ui/drawer";

type ChallengeDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  achievementPicsUrl: string;
  achievementTitle: string;
  reputation: number;
  senderName: string;
  userId: number;
  description: string;
  status: string;
  isSent: boolean;
  isPromo: boolean;
  challengeId: number;
  initDataRaw: string;
  refreshChallenges: () => Promise<void>;
  fieldId?: string | null;
  taskUrl?: string;
};

export function ChallengeDrawer({
  isOpen,
  onClose,
  achievementPicsUrl,
  achievementTitle,
  reputation,
  senderName,
  userId,
  description,
  status,
  isSent,
  isPromo,
  challengeId,
  initDataRaw,
  refreshChallenges,
  fieldId,
  taskUrl,
}: ChallengeDrawerProps) {
  const [progress, setProgress] = React.useState<number>(0);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isLoadingAccept, setIsLoadingAccept] = React.useState(false);
  const [isLoadingDecline, setIsLoadingDecline] = React.useState(false);
  const [isLoadingApprove, setIsLoadingApprove] = React.useState(false);
  const [isLoadingDispute, setIsLoadingDispute] = React.useState(false);
  const [isLoadingHide, setIsLoadingHide] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleApproveSubmit = () => {
    setErrorMessage(""); // Очистить сообщение об ошибке при повторной попытке
    fileInputRef.current?.click();
  };

  const handleUpload = (selectedFile: File) => {
    if (!selectedFile) {
      setErrorMessage("Пожалуйста, выберите видеофайл.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();

    const url = isPromo
      ? `https://starfish-app-le4cb.ondigitalocean.app/api/promochallenges/${challengeId}/complete`
      : `https://starfish-app-le4cb.ondigitalocean.app/api/challenges/${challengeId}/complete`;

    xhr.open("POST", url, true);

    xhr.setRequestHeader("accept", "*/*");
    xhr.setRequestHeader("initData", initDataRaw);

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
        setErrorMessage("Не удалось загрузить видео.");
      }
    });

    xhr.onerror = () => {
      console.log("xhr.onerror", xhr);
      console.error("Ошибка при загрузке видео");
      setErrorMessage("Не удалось загрузить видео.");
    };

    xhr.send(formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      if (!selectedFile.type.startsWith("video/")) {
        setErrorMessage("Пожалуйста, загрузите видеофайл.");
        return;
      }

      const maxSizeInBytes = 20 * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        setErrorMessage("Размер видео не должен превышать 20 МБ.");
        return;
      }

      handleUpload(selectedFile);
    }
  };

  const handleAccept = async () => {
    setIsLoadingAccept(true);
    try {
      const url = isPromo
        ? `https://starfish-app-le4cb.ondigitalocean.app/api/promochallenges/${challengeId}/start`
        : `https://starfish-app-le4cb.ondigitalocean.app/api/challenges/${challengeId}/accept`;

      const method = isPromo ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          initData: initDataRaw,
        },
      });

      if (response.ok) {
        alert("Задание принято.");
        onClose();
        refreshChallenges();
      } else {
        console.error("Ошибка при принятии задания", response.statusText);
        setErrorMessage("Не удалось принять задание.");
      }
    } catch (error) {
      console.error("Произошла ошибка при принятии задания:", error);
      setErrorMessage("Произошла ошибка при принятии задания.");
    } finally {
      setIsLoadingAccept(false);
    }
  };

  const handleDecline = async () => {
    setIsLoadingDecline(true);
    try {
      const response = await fetch(
        `https://starfish-app-le4cb.ondigitalocean.app/api/challenges/${challengeId}/decline`,
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
        setErrorMessage("Не удалось отклонить задание.");
      }
    } catch (error) {
      console.error("Произошла ошибка при отклонении задания:", error);
      setErrorMessage("Произошла ошибка при отклонении задания.");
    } finally {
      setIsLoadingDecline(false);
    }
  };

  const handleApprove = async () => {
    setIsLoadingApprove(true);
    try {
      const url = isPromo
        ? `https://starfish-app-le4cb.ondigitalocean.app/api/promochallenges/${challengeId}/approve`
        : `https://starfish-app-le4cb.ondigitalocean.app/api/challenges/${challengeId}/approve`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          initData: initDataRaw,
        },
      });

      if (response.ok) {
        alert("Задание подтверждено.");
        await refreshChallenges();
        onClose();
      } else {
        console.error("Ошибка при подтверждении задания", response.statusText);
        setErrorMessage("Не удалось подтвердить задание.");
      }
    } catch (error) {
      console.error("Произошла ошибка при подтверждении задания:", error);
      setErrorMessage("Произошла ошибка при подтверждении задания.");
    } finally {
      setIsLoadingApprove(false);
    }
  };

  const handleDispute = async () => {
    const confirmed = window.confirm(
      "Вы уверены, что не хотите принимать задание? В случае спора никто из участников не получит свои средства назад."
    );
    if (!confirmed) return;

    setIsLoadingDispute(true);
    try {
      const url = isPromo
        ? `https://starfish-app-le4cb.ondigitalocean.app/api/promochallenges/${challengeId}/dispute`
        : `https://starfish-app-le4cb.ondigitalocean.app/api/challenges/${challengeId}/dispute`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          initData: initDataRaw,
        },
      });

      if (response.ok) {
        alert("Вы не приняли задание.");
        await refreshChallenges();
        onClose();
      } else {
        console.error("Ошибка при начале спора", response.statusText);
        setErrorMessage("Не удалось начать спор.");
      }
    } catch (error) {
      console.error("Произошла ошибка при начале спора:", error);
      setErrorMessage("Произошла ошибка при начале спора.");
    } finally {
      setIsLoadingDispute(false);
    }
  };

  const hideChallenge = async (id: number) => {
    setIsLoadingHide(true);
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
        setErrorMessage("Не удалось удалить задание из истории.");
        return;
      }

      await refreshChallenges();
      onClose();
    } catch (error) {
      console.error("Произошла ошибка при удалении задания:", error);
      setErrorMessage("Произошла ошибка при удалении задания.");
    } finally {
      setIsLoadingHide(false);
    }
  };

  const shouldShowButtons =
    !isSent && !["APPROVE", "DECLINED", "DISPUTED"].includes(status);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <img
          src={`https://starfish-app-le4cb.ondigitalocean.app/api/images/${achievementPicsUrl}`}
          alt={achievementTitle}
          className="w-full h-40 aspect-square object-contain select-none pointer-events-none rounded-md mb-4"
        />
        <header className="flex flex-col items-center">
          <h1 id="challenge-title" className="text-xl font-bold">
            {achievementTitle}
          </h1>
          {isPromo ? (
            <a
              href={taskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 my-2"
            >
              Выполнить
            </a>
          ) : (
            <Link
              href={`/profile/${userId}`}
              className="text-sm text-gray-600 my-2"
            >
              {senderName}
            </Link>
          )}
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
        </header>
        <p className="mt-4 mb-4 px-4 text-center font-medium text-sm">
          {description}
        </p>

        {errorMessage && (
          <div className="mb-4 px-4 text-center">
            <p className="text-red-600 font-semibold">{errorMessage}</p>
          </div>
        )}

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
                  src={`https://starfish-app-le4cb.ondigitalocean.app/api/videos/download?fileId=${fieldId}`}
                  type="video/mp4"
                />
                Ваш браузер не поддерживает видео.
              </video>
            </figure>
          </div>
        )}

        <footer className="flex flex-col w-full gap-2 px-4">
          {shouldShowButtons &&
            (status === "PENDING" || status === "IN_PROGRESS") && (
              <>
                <Button
                  variant="secondary"
                  onClick={handleAccept}
                  isLoading={isLoadingAccept}
                  className="w-full"
                >
                  Принять
                </Button>
                {!isPromo && (
                  <Button
                    variant="outline"
                    onClick={handleDecline}
                    isLoading={isLoadingDecline}
                    className="w-full"
                  >
                    Отказаться
                  </Button>
                )}
              </>
            )}

          {status === "ACCEPTED" && !isSent && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {progress > 0 ? (
                <Progress className="w-full h-1" value={progress} />
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleApproveSubmit}
                    className="w-full"
                  >
                    Загрузить подтверждение
                  </Button>
                  {!isPromo && (
                    <Button
                      variant="outline"
                      onClick={handleDecline}
                      isLoading={isLoadingDecline}
                      className="w-full"
                    >
                      Отказаться
                    </Button>
                  )}
                </>
              )}
            </>
          )}

          {isSent && status === "COMPLETED" && (
            <>
              <Button
                variant="secondary"
                onClick={handleApprove}
                isLoading={isLoadingApprove}
                className="w-full"
              >
                Подтвердить
              </Button>
              <Button
                variant="outline"
                onClick={handleDispute}
                isLoading={isLoadingDispute}
                className="w-full"
              >
                Не принимаю
              </Button>
            </>
          )}

          {status === "COMPLETED" && !isSent && !isPromo && (
            <Button
              onClick={handleDecline}
              isLoading={isLoadingDecline}
              variant="outline"
              className="w-full"
            >
              Отказаться
            </Button>
          )}

          {((!isPromo && status === "DISPUTED") ||
            status === "DECLINED" ||
            status === "APPROVE") && (
            <Button
              variant="ghost"
              className="text-red-700 bg-red-100/50"
              onClick={() => hideChallenge(challengeId)}
              isLoading={isLoadingHide}
            >
              Удалить запись из истории
            </Button>
          )}
        </footer>
      </div>
    </Drawer>
  );
}
