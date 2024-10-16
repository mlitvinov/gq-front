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
  const handleRequest = async (url: string) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      accept: "*/*",
      initData: initDataRaw,
    };

    try {
      const response = await fetch(url, { method: "PUT", headers });
      if (!response.ok) console.error(`Ошибка: ${response.statusText}`);
    } catch (error) {
      console.error(`Произошла ошибка: ${error}`);
    }
  };

  const handleApprove = async () => {
    await handleRequest(`https://getquest.tech:8443/api/challenges/${challengeId}/approve`);
    onClose();
    refreshChallenges();
  };

  const handleDispute = async () => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите начать спор? В случае спора никто не получит свои средства назад."
    );
    if (!confirmed) return;

    await handleRequest(`https://getquest.tech:8443/api/challenges/${challengeId}/dispute`);
    onClose();
    refreshChallenges();
  };

  const handleAccept = async () => {
    await handleRequest(`https://getquest.tech:8443/api/challenges/${challengeId}/accept`);
    onClose();
    refreshChallenges();
  };

  const handleDecline = async () => {
    await handleRequest(`https://getquest.tech:8443/api/challenges/${challengeId}/decline`);
    onClose();
    refreshChallenges();
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
                <Button onClick={handleAccept} variant="secondary" className="w-full">
                  Принять
                </Button>
                <Button onClick={handleDecline} variant="outline" className="w-full">
                  Отказаться
                </Button>
              </>
            )}
            {shouldShowButtons && status === "ACCEPTED" && (
              <>
                <Button variant="secondary" className="w-full">
                  Загрузить видео
                </Button>
                <Button onClick={handleDecline} variant="outline" className="w-full">
                  Отказаться
                </Button>
              </>
            )}
            {status === "COMPLETED" && isSent && (
              <>
                <Button onClick={handleApprove} variant="secondary" className="w-full">
                  Подтвердить
                </Button>
                <Button onClick={handleDispute} variant="outline" className="w-full">
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
