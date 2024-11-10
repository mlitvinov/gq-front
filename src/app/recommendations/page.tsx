"use client";

import React, { useEffect, useRef, useState } from "react";

// Расширяем интерфейс HTMLVideoElement для поддержки webkit методов
interface HTMLVideoElementWithWebkit extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
}

const RecommendationsPage = () => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElementWithWebkit | null>(null);

  // Замените "YOUR_INIT_DATA" на ваши актуальные данные, избегая размещения личной информации в публичном коде
  const initDataRaw = "YOUR_INIT_DATA";

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const headers: HeadersInit = {
          accept: "*/*",
          initData: initDataRaw,
        };

        const response = await fetch(
          "https://getquest.tech:6443/api/videos/download?fileId=YOUR_VIDEO_FILE_ID",
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
      // Обработчик для воспроизведения видео при входе в полноэкранный режим
      const handleWebkitBeginFullscreen = () => {
        videoElement.play().catch((error) => {
          console.error("Ошибка воспроизведения видео в полноэкранном режиме:", error);
        });
      };

      // Обработчик для продолжения воспроизведения после выхода из полноэкранного режима
      const handleWebkitEndFullscreen = () => {
        videoElement.play().catch((error) => {
          console.error("Ошибка воспроизведения видео после выхода из полноэкранного режима:", error);
        });
      };

      // Добавляем обработчики событий для iOS Safari
      videoElement.addEventListener(
        "webkitbeginfullscreen",
        handleWebkitBeginFullscreen
      );
      videoElement.addEventListener(
        "webkitendfullscreen",
        handleWebkitEndFullscreen
      );

      return () => {
        videoElement.removeEventListener(
          "webkitbeginfullscreen",
          handleWebkitBeginFullscreen
        );
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
