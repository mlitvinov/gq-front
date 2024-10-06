"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "./slider"; // Анимация
import Arrows from "@/assets/arrows.png";
import Rewards from "@/assets/rewards.png";
import { useLaunchParams } from "@telegram-apps/sdk-react";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [achievementImages, setAchievementImages] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]); // Для хранения списка videoUrl
  const [videoResources, setVideoResources] = useState([]); // Для хранения загруженных видео
  const initDataRaw = useLaunchParams().initDataRaw;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Загрузка данных профиля
    const fetchProfileData = async () => {
      try {
        const response = await fetch("https://getquest.tech:8443/api/users/profile", {
          method: "GET",
          headers: {
            "accept": "*/*",
            "initData": initDataRaw
          }
        });
        const data = await response.json();
        setUserData({
          ...data,
          completedTasks: data.taskCount,   // Используем taskCount из DTO
          totalReputation: data.earnedCount // Используем earnedCount из DTO
        });
        setAchievementImages(data.achievementListDTO.map(achievement => `https://getquest.tech:8443${achievement.imageUrl}`));
      } catch (error) {
        console.error("Ошибка при загрузке данных профиля:", error);
      }
    };

    fetchProfileData();
  }, [initDataRaw]);

  useEffect(() => {
    // Загрузка списка videoUrl для пользователя
    const fetchVideoUrls = async () => {
      if (!userData) return;

      try {
        const response = await fetch(`https://getquest.tech:8443/api/challenges/user/video-urls?userId=${userData.id}`, {
          method: "GET",
          headers: {
            "accept": "*/*",
            "initData": initDataRaw
          }
        });
        const urls = await response.json();
        setVideoUrls(urls); // Сохраняем полученные URL
      } catch (error) {
        console.error("Ошибка при получении видео URL:", error);
      }
    };

    fetchVideoUrls();
  }, [userData, initDataRaw]);

  useEffect(() => {
    // Загрузка каждого видео по fileId
    const fetchVideoResources = async () => {
      if (videoUrls.length === 0) return;

      const resources = await Promise.all(videoUrls.map(async (fileId) => {
        try {
          const response = await fetch(`https://getquest.tech:8443/api/videos/download?fileId=${fileId}`, {
            method: "GET",
            headers: {
              "accept": "*/*",
              "initData": initDataRaw
            }
          });

          if (response.ok) {
            const blob = await response.blob();
            const videoUrl = window.URL.createObjectURL(blob);
            return videoUrl; // Возвращаем URL загруженного видео
          } else {
            console.error(`Ошибка при загрузке видео ${fileId}:`, response.status);
            return null;
          }
        } catch (error) {
          console.error("Ошибка при загрузке видео:", error);
          return null;
        }
      }));

      setVideoResources(resources.filter(Boolean)); // Сохраняем только успешные загрузки
    };

    fetchVideoResources();
  }, [videoUrls, initDataRaw]);

  if (!userData) {
    return <div>Загрузка...</div>;
  }

  return (
    <main className="relative flex flex-col items-center rounded-t-[2rem] bg-white px-5 pt-8 pb-[calc(80px+1rem)]">
      <section className="flex flex-col justify-center items-center mb-16">
        <img
          className="relative left-1"
          src={Rewards.src}
          width={80}
          height={80}
        />
        <h1 className="text-gradient text-3xl font-black">{userData.rating}</h1>
        <p className="text-black">@{userData.username}</p>
      </section>
      <section className="flex flex-col gap-3 mb-6">
        <Slider elements={achievementImages} />
      </section>
      <section className="mb-6">
        <h1 className="text-black text-2xl text-left font-medium tracking-[-0.05em] mb-6">
          Completed <span className="text-gradient font-black">{userData.completedTasks}</span> tasks{" "}
          <img
            className="inline -left-1 top-0 relative"
            src={Rewards.src}
            width={32}
            height={32}
          />
          <br />
          <img
            className="inline -left-1 relative"
            src={Arrows.src}
            width={32}
            height={32}
          />
          earn <span className="text-gradient">{userData.totalReputation}</span> reputation in total
        </h1>
      </section>
      <section className="video-slider flex flex-row gap-3 overflow-hidden"> {/* Добавляем класс для анимации */}
        {videoResources.length > 0 ? (
          videoResources.map((videoSrc, index) => (
            <figure key={index}
                    className="rounded-full overflow-hidden w-64 h-64 bg-[#F6F6F6] flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                className="w-full h-full object-cover rounded-full"  // Видео в форме круга
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </figure>
          ))
        ) : (
          <div>No videos available</div>
        )}
      </section>
    </main>
  );
}

