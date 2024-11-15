"use client";

import React from "react";
import Cat from "@/app/_assets/worker-cat.png";
import { useTranslations } from "next-intl";

const RecommendationsPage = () => {
  const t = useTranslations("recommendations");
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center">
        <img alt="Cat emoji" src={Cat.src} className="w-32 h-32 object-contain mb-6 mx-auto" />
        <h1 className="text-2xl font-black text-black">{t("soon")}</h1>
        <h1 className="text-2xl text-gradient ml-auto font-semibold text-black">12/12/2024</h1>
      </div>
    </main>
  );
};

export default RecommendationsPage;
