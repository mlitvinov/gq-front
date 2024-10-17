import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";

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
                                }: ChallengeDrawerProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

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
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <img
            src={`https://getquest.tech:8443/images/${achievementPicsUrl}`}
            alt={achievementTitle}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <DrawerHeader>
            <h2 className="text-xl font-bold">{achievementTitle}</h2>
            <p className="text-lg text-gradient">{reputation} репутации</p>
            <p className="text-sm text-gray-600">{senderName}</p>
          </DrawerHeader>
          <p className="mt-4 mb-8 px-4 text-sm">{description}</p>
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
            {status === "ACCEPTED" && (
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
