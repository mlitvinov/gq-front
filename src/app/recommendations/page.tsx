"use client";

import React from "react";
import Cat from "@/assets/worker-cat.avif";

const RecommendationsPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-center">
        <img
          src={Cat.src}
          alt="Worker Cat"
          className="w-32 h-32 object-contain mb-6 mx-auto"
        />
        <h1 className="text-2xl font-black text-black">СКОРО</h1>
        <h1 className="text-2xl text-gradient  ml-auto font-semibold text-black">
          12/12/2024
        </h1>
      </div>
    </main>
  );
};

export default RecommendationsPage;
