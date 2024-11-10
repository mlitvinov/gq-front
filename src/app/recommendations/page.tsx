"use client";

import React, { useEffect, useRef, useState } from "react";

// Расширяем интерфейс HTMLVideoElement для поддержки webkit методов
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: void;
}

const RecommendationsPage = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElementWithWebkit | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Замените "YOUR_INIT_DATA" на ваши актуальные данные, избегая размещения личной информации в публичном коде
  const initDataRaw =
    "query_id=AAE7x2YTAAAAADvHZhNRiDIy&user=%7B%22id%22%3A325502779%2C%22first_name%22%3A%22%D0%9C%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22youngfreud%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1731193463&hash=75cd76133105a2fdc831829638bb9d00a4107ec29d302ef29a8de419e8377281";

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const headers: HeadersInit = {
          accept: "*/*",
          initData: initDataRaw,
        };

        const response = await fetch(
          "https://getquest.tech:6443/api/videos/download?fileId=BAACAgIAAxkDAAMYZxqRxiDLat32BysdgtMp671RRZUAAoNhAAIErtFIVqT_SQHZ-Bc2BA",
          {
            method: "GET",
            headers,
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = window.URL.createObjectURL(blob);
          setVideoSrc(objectUrl);
        } else {
          console.error("Ошибка при загрузке видео:", response.status);
        }
      } catch (error) {
        console.error("Ошибка при загрузке видео:", error);
      }
    };

    fetchVideo();

    return () => {
      if (videoSrc) {
        window.URL.revokeObjectURL(videoSrc);
      }
    };
  }, []);

  const handlePlayButton = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Ошибка воспроизведения видео:", error);
      });
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch((error) => {
          console.error("Ошибка воспроизведения видео:", error);
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleFullScreen = () => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center justify-center px-4">
        <div className="relative w-72 h-72 rounded-full overflow-hidden mt-8 bg-gray-700 flex items-center justify-center">
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted
              onClick={handleVideoClick}
              onEnded={() => setIsPlaying(false)}
            />
          )}
          {!isPlaying && (
            <button
              onClick={handlePlayButton}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <polygon points="5,3 19,12 5,21" fill="currentColor" />
              </svg>
            </button>
          )}
          {/* Кнопка для полноэкранного режима */}
          {isPlaying && (
            <button
              onClick={handleFullScreen}
              className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" />
              </svg>
            </button>
          )}
        </div>

        {/* Текстовые элементы */}
        <h1 className="text-xl text-black font-bold mt-4">USERNAME</h1>
        <h2 className="text-lg text-black font-semibold">Гурман</h2>
        <p className="text-base text-black">Съешь лимон</p>

        {/* Кнопки */}
        <div className="flex justify-between mt-6 w-full max-w-sm mx-auto px-4">
          <button className="bg-gray-700 text-white rounded-full px-6 py-2">
            Dislike
          </button>
          <button
            style={{ backgroundColor: "#FEEF9E", color: "black" }}
            className="bg-blue-500 text-white rounded-full px-4 py-2"
          >
            Принять
          </button>
          <button className="bg-gray-700 text-white rounded-full px-6 py-2">
            Like
          </button>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;
