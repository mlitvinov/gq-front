"use client";

import React, { useEffect, useState, useRef } from "react";
import { FiMaximize, FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Link } from "@/components/Link/Link";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction: number) => ({
    x: direction * 1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction * -1000,
    opacity: 0,
  }),
};

const RecommendationsPage = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [achievementTitle, setAchievementTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Получаем initData из контекста
  const initDataRaw = useSignal(initData.raw);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const headers: HeadersInit = {
        accept: "application/json",
      };

      if (initDataRaw) {
        headers.initData = initDataRaw;
      }

      // Запрашиваем текущее видео
      const response = await fetch("https://getquest.tech/api/feed/current", {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const videoData = await response.json();
        if (videoData && videoData.videoUrl) {
          setVideoId(videoData.id);

          // Устанавливаем данные из DTO
          setUsername(videoData.username);
          setUserId(videoData.userId);
          setAchievementTitle(videoData.achievementTitle);
          setDescription(videoData.description);

          // Получаем URL для скачивания видео
          const videoUrl = `https://getquest.tech/api/videos/download?fileId=${videoData.videoUrl}`;

          setVideoSrc(videoUrl);
          setPage((p) => p + 1);
        } else {
          console.error("Видео не найдено в ответе сервера.");
          setVideoSrc(null);
          setVideoId(null);
          setUsername("");
          setUserId(null);
          setAchievementTitle("");
          setDescription("");
        }
      } else if (response.status === 204) {
        console.log("Видео больше нет.");
        setVideoSrc(null);
        setVideoId(null);
        setUsername("");
        setUserId(null);
        setAchievementTitle("");
        setDescription("");
      } else {
        console.error("Ошибка при загрузке видео:", response.status);
        setVideoSrc(null);
        setVideoId(null);
        setUsername("");
        setUserId(null);
        setAchievementTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error("Ошибка при загрузке видео:", error);
      setVideoSrc(null);
      setVideoId(null);
      setUsername("");
      setUserId(null);
      setAchievementTitle("");
      setDescription("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();

    return () => {
      if (videoSrc) {
        window.URL.revokeObjectURL(videoSrc);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const likeVideo = async () => {
    if (!videoId) return;
    setDirection(-1); // Анимация влево при лайке

    try {
      const headers: HeadersInit = {
        accept: "application/json",
      };

      if (initDataRaw) {
        headers.initData = initDataRaw;
      }

      const response = await fetch(`https://getquest.tech/api/feed/like?videoId=${videoId}`, {
        method: "POST",
        headers,
      });

      if (response.ok) {
        // Загружаем следующее видео
        await fetchVideo();
      } else {
        console.error("Ошибка при лайке видео:", response.status);
      }
    } catch (error) {
      console.error("Ошибка при лайке видео:", error);
    }
  };

  const dislikeVideo = async () => {
    if (!videoId) return;
    setDirection(1); // Анимация вправо при дизлайке

    try {
      const headers: HeadersInit = {
        accept: "application/json",
      };

      if (initDataRaw) {
        headers.initData = initDataRaw;
      }

      const response = await fetch(`https://getquest.tech/api/feed/dislike?videoId=${videoId}`, {
        method: "POST",
        headers,
      });

      if (response.ok) {
        // Загружаем следующее видео
        await fetchVideo();
      } else {
        console.error("Ошибка при дизлайке видео:", response.status);
      }
    } catch (error) {
      console.error("Ошибка при дизлайке видео:", error);
    }
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      const videoElement = video as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void;
      };
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitEnterFullscreen) {
        videoElement.webkitEnterFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center justify-center px-4">
        <div className="w-72 h-72 mt-8 relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              className="w-72 rounded-full overflow-hidden  h-72 bg-gray-700 flex items-center justify-center"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {loading && <p className="text-white">Loading...</p>}
              {videoSrc && !loading && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  controls={false}
                  loop
                  playsInline
                  autoPlay
                  onClick={(e) => {
                    const v = e.currentTarget as HTMLVideoElement;
                    v.paused ? v.play() : v.pause();
                  }}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              )}
            </motion.div>
          </AnimatePresence>
          <button type="button" onClick={handleFullscreen} className="absolute py-2 top-2 right-2 text-black rounded p-1 z-10">
            <FiMaximize size={24} />
          </button>
        </div>

        {/* Текстовые элементы */}
        {username && userId && (
          <h1 className="text-xl text-blue-500 font-bold mt-4">
            <Link href={`/profile/${userId}`}>@{username}</Link>
          </h1>
        )}
        {achievementTitle && <h2 className="text-lg text-black font-semibold">{achievementTitle}</h2>}
        {description && <p className="text-base text-black">{description}</p>}

        {/* Кнопки */}
        <div className="flex justify-between mt-6 w-full max-w-sm mx-auto px-4">
          <motion.button onClick={dislikeVideo} disabled={!videoId || loading} className="bg-gray-300 text-black rounded px-6 py-2" whileTap={{ scale: 0.9 }}>
            <FiThumbsDown size={24} />
          </motion.button>
          <motion.button onClick={likeVideo} disabled={!videoId || loading} className="bg-blue-500 text-black rounded px-6 py-2" style={{ backgroundColor: "#ABD6E0", color: "black" }} whileTap={{ scale: 0.9 }}>
            <FiThumbsUp size={24} />
          </motion.button>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;
