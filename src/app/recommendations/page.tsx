"use client";

import React, { useEffect, useState, useRef } from "react";
import { FiMaximize, FiRefreshCw, FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import { initData, useSignal } from "@telegram-apps/sdk-react";

const RecommendationsPage = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [achievementTitle, setAchievementTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
          setAchievementTitle(videoData.achievementTitle);
          setDescription(videoData.description);

          // Получаем URL для скачивания видео
          const videoUrl = `https://getquest.tech/api/videos/download?fileId=${videoData.videoUrl}`;

          // Загружаем видео
          const videoResponse = await fetch(videoUrl, {
            method: "GET",
            headers,
          });

          if (videoResponse.ok) {
            const blob = await videoResponse.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            setVideoSrc(objectUrl);
          } else {
            console.error("Ошибка при загрузке видео:", videoResponse.status);
            setVideoSrc(null);
          }
        } else {
          console.error("Видео не найдено в ответе сервера.");
          setVideoSrc(null);
          setVideoId(null);
          setUsername("");
          setAchievementTitle("");
          setDescription("");
        }
      } else if (response.status === 204) {
        console.log("Видео больше нет.");
        setVideoSrc(null);
        setVideoId(null);
        setUsername("");
        setAchievementTitle("");
        setDescription("");
      } else {
        console.error("Ошибка при загрузке видео:", response.status);
        setVideoSrc(null);
        setVideoId(null);
        setUsername("");
        setAchievementTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error("Ошибка при загрузке видео:", error);
      setVideoSrc(null);
      setVideoId(null);
      setUsername("");
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
        fetchVideo();
      } else {
        console.error("Ошибка при лайке видео:", response.status);
      }
    } catch (error) {
      console.error("Ошибка при лайке видео:", error);
    }
  };

  const dislikeVideo = async () => {
    if (!videoId) return;

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
        fetchVideo();
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
        <div className="w-72 h-72 rounded-full overflow-hidden mt-8 bg-gray-700 flex items-center justify-center relative">
          {loading && <p className="text-white">Загрузка...</p>}
          {videoSrc && !loading && (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                controls={false}
                loop
                playsInline
                autoPlay
                onClick={(e) => {
                  const video = e.currentTarget as HTMLVideoElement;
                  if (video.paused) {
                    video.play();
                  } else {
                    video.pause();
                  }
                }}
              />
            </>
          )}
        </div>
        <button
          onClick={handleFullscreen}
          className="absolute py-2 top-2 right-2 text-black rounded p-1"
        >
          <FiMaximize size={24} />
        </button>

        {/* Текстовые элементы */}
        {username && (
          <h1 className="text-xl text-black font-bold mt-4">@{username}</h1>
        )}
        {achievementTitle && (
          <h2 className="text-lg text-black font-semibold">{achievementTitle}</h2>
        )}
        {description && (
          <p className="text-base text-black">{description}</p>
        )}

        {/* Кнопки */}
        <div className="flex justify-between mt-6 w-full max-w-sm mx-auto px-4">
          <button
            onClick={dislikeVideo}
            disabled={!videoId || loading}
            className="bg-gray-300 text-black rounded px-6 py-2"
          >
            <FiThumbsDown size={24} />
          </button>
          <button
            disabled={true} // Отключаем кнопку "Пропустить"
            className="bg-blue-500 text-white rounded px-4 py-2"
            style={{ backgroundColor: "#FEEF9E", color: "black" }}
          >
            <FiRefreshCw size={24} />
          </button>
          <button
            onClick={likeVideo}
            disabled={!videoId || loading}
            className="bg-blue-500 text-white rounded px-6 py-2"
            style={{ backgroundColor: "#ABD6E0", color: "black" }}
          >
            <FiThumbsUp size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;
