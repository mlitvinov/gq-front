"use client";

import React, { useEffect, useRef, useState } from "react";

// Расширяем интерфейс HTMLVideoElement для поддержки webkitEnterFullscreen
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void; // Добавляем метод webkitEnterFullscreen
}

const RecommendationsPage = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElementWithWebkit | null>(null);

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

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleWebkitEndFullscreen = () => {
        // Продолжаем воспроизведение после выхода из полноэкранного режима
        videoElement.play().catch((error) => {
          console.error("Ошибка воспроизведения видео:", error);
        });
      };

      // Добавляем обработчик события 'webkitendfullscreen' для iOS Safari
      videoElement.addEventListener(
        "webkitendfullscreen",
        handleWebkitEndFullscreen
      );

      return () => {
        videoElement.removeEventListener(
          "webkitendfullscreen",
          handleWebkitEndFullscreen
        );
      };
    }
  }, [videoSrc]);

  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center justify-center px-4">
        <div className="w-72 h-72 rounded-full overflow-hidden mt-8 bg-gray-700 flex items-center justify-center">
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              controls={false}
              loop
              playsInline
              autoPlay
              muted
              onClick={(e) => {
                const video = e.currentTarget as HTMLVideoElementWithWebkit;
                if (video.requestFullscreen) {
                  video.requestFullscreen();
                } else if (video.webkitEnterFullscreen) {
                  video.webkitEnterFullscreen();
                }
              }}
            />
          )}
        </div>

        <h1 className="text-xl text-black font-bold mt-4">USERNAME</h1>
        <h2 className="text-lg text-black font-semibold">Гурман</h2>
        <p className="text-base text-black">Съешь лимон</p>

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
