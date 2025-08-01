"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { Link } from "@/components/Link/Link";
import Rewards from "@/app/_assets/rewards.png";
import { Progress } from "@/components/ui/progress";
import { BASE_URL } from "@/lib/const";
import Drawer from "@/components/ui/drawer";
import { initData } from "@telegram-apps/sdk-react";
import { api } from "@/lib/api";

import { useTranslations } from "next-intl";

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
  refreshChallenges: () => Promise<void>;
  danger: boolean;
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
                                  refreshChallenges,
                                  danger,
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

  const t = useTranslations("challenges");

  const handleApproveSubmit = () => {
    setErrorMessage("");
    fileInputRef.current?.click();
  };

  const handleUpload = (selectedFile: File) => {
    const initDataRaw = initData.raw();

    if (!initDataRaw) {
      setErrorMessage(t("error_reload"));
      return;
    }

    if (!selectedFile) {
      setErrorMessage(t("select_video"));
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    const url = isPromo ? `/api/promochallenges/${challengeId}/complete` : `/api/challenges/${challengeId}/complete`;

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
        alert(t("video_done"));
        onClose();
        refreshChallenges();
      } else {
        console.error("Video upload error");
        setErrorMessage(t("upload_failed"));
      }
    });

    xhr.onerror = () => {
      console.error("Video upload error");
      setErrorMessage(t("upload_failed"));
    };

    xhr.send(formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      if (!selectedFile.type.startsWith("video/")) {
        setErrorMessage(t("upload_video"));
        return;
      }

      const maxSizeInBytes = 20 * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        setErrorMessage(t("video_size_limit"));
        return;
      }

      handleUpload(selectedFile);
    }
  };

  const handleAccept = async () => {
    setIsLoadingAccept(true);

    try {
      const url = isPromo ? `/api/promochallenges/${challengeId}/start` : `/api/challenges/${challengeId}/accept`;

      await (isPromo ? api.post(url) : api.put(url));

      alert(t("task_done"));
      onClose();
      await refreshChallenges();
      setIsLoadingAccept(false);
    } catch (error) {
      console.error("Error accepting challenge:", error);
      setErrorMessage(t("accept_error"));
      setIsLoadingAccept(false);
    }
  };

  const handleDecline = async () => {
    setIsLoadingDecline(true);

    try {
      await api.put(`/api/challenges/${challengeId}/decline`);

      alert(t("task_decline"));
      onClose();
      await refreshChallenges();
      setIsLoadingDecline(false);
    } catch (error) {
      console.error("Error declining challenge:", error);
      setErrorMessage(t("decline_error"));
      setIsLoadingDecline(false);
    }
  };

  const handleApprove = async () => {
    setIsLoadingApprove(true);

    try {
      const url = isPromo ? `/api/promochallenges/${challengeId}/approve` : `/api/challenges/${challengeId}/approve`;

      await api.put(url);

      alert(t("task_approved"));
      await refreshChallenges();

      onClose();
      setIsLoadingApprove(false);
    } catch (error) {
      console.error("Error approving challenge:", error);
      setErrorMessage(t("approve_error"));
      setIsLoadingApprove(false);
    }
  };

  const handleDispute = async () => {
    const confirmed = window.confirm(t("dispute_confirm"));
    if (!confirmed) return;

    setIsLoadingDispute(true);
    try {
      const url = isPromo ? `/api/promochallenges/${challengeId}/dispute` : `/api/challenges/${challengeId}/dispute`;

      await api.put(url);

      alert(t("task_declined"));
      await refreshChallenges();

      onClose();
      setIsLoadingDispute(false);
    } catch (error) {
      console.error("Error starting dispute:", error);
      setErrorMessage(t("dispute_error"));
      setIsLoadingDispute(false);
    }
  };

  const hideChallenge = async (id: number) => {
    setIsLoadingHide(true);

    const confirmed = window.confirm(t("hide_confirm"));
    if (!confirmed) return;

    try {
      await api.put(`/api/challenges/${id}/hide`);

      await refreshChallenges();
      onClose();
      setIsLoadingHide(false);
    } catch (error) {
      console.error("Error hiding challenge:", error);
      setErrorMessage(t("hide_error"));
      setIsLoadingHide(false);
    }
  };

  const shouldShowButtons = !isSent && !["APPROVE", "DECLINED", "DISPUTED"].includes(status);

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div className="flex flex-col mb-6 items-center">
        <img
          src={`${BASE_URL}/api/images/${achievementPicsUrl}`}
          alt={achievementTitle}
          className="w-full h-40 aspect-square object-contain select-none pointer-events-none rounded-md mb-4"
        />
        <header className="flex flex-col items-center">
          <h1 id="challenge-title" className="text-xl font-bold">
            {achievementTitle}
          </h1>
          {isPromo && taskUrl ? (
            <a
              href={taskUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 my-2"
            >
              {t("complete")}
            </a>
          ) : !isPromo ? (
            <Link href={`/profile/${userId}`} className="text-sm text-gray-600 my-2">
              {senderName}
            </Link>
          ) : null}
          <p className="text-3xl text-gradient ml-4 font-black">
            <span className="mr-1">{reputation}</span>
            <img className="inline relative -top-0.5" src={Rewards.src} height={32} width={32} />
          </p>
        </header>
        <p className="mt-4 mb-4 px-4 text-center font-medium text-sm">{description}</p>
        {danger && (
          <div className="mb-4 px-4 text-red-600 text-sm text-center">
            {t("danger-warning")}
          </div>
        )}

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
                <source src={`${BASE_URL}/api/videos/download?fileId=${fieldId}`} type="video/mp4" />
                ERROR
              </video>
            </figure>
          </div>
        )}

        <footer className="flex flex-col w-full gap-2 px-4 mb-[--safe-area-inset-bottom]">
          {shouldShowButtons && (status === "PENDING" || status === "IN_PROGRESS") && (
            <>
              <Button variant="secondary" onClick={handleAccept} isLoading={isLoadingAccept} className="w-full">
                {t("accept")}
              </Button>
              {!isPromo && (
                <Button variant="outline" onClick={handleDecline} isLoading={isLoadingDecline} className="w-full">
                  {t("decline")}
                </Button>
              )}
            </>
          )}

          {status === "ACCEPTED" && !isSent && (
            <>
              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

              {progress > 0 ? (
                <Progress className="w-full h-1" value={progress} />
              ) : (
                <>
                  <Button variant="secondary" onClick={handleApproveSubmit} className="w-full">
                    {t("upload_confirmation")}
                  </Button>
                  {!isPromo && (
                    <Button variant="outline" onClick={handleDecline} isLoading={isLoadingDecline} className="w-full">
                      {t("decline")}
                    </Button>
                  )}
                </>
              )}
            </>
          )}

          {isSent && status === "COMPLETED" && (
            <>
              <Button variant="secondary" onClick={handleApprove} isLoading={isLoadingApprove} className="w-full">
                {t("approve")}
              </Button>
              <Button variant="outline" onClick={handleDispute} isLoading={isLoadingDispute} className="w-full">
                {t("reject")}
              </Button>
            </>
          )}

          {status === "COMPLETED" && !isSent && !isPromo && (
            <Button onClick={handleDecline} isLoading={isLoadingDecline} variant="outline" className="w-full">
              {t("decline")}
            </Button>
          )}

          {((!isPromo && status === "DISPUTED") || status === "DECLINED" || status === "APPROVE") && (
            <Button variant="ghost" className="text-red-700 bg-red-100/50" onClick={() => hideChallenge(challengeId)} isLoading={isLoadingHide}>
              {t("delete_entry")}
            </Button>
          )}
        </footer>
      </div>
    </Drawer>
  );
}
