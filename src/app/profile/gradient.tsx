"use client";

import { Common, View } from "@/components/canvas/view";
import { Suspense } from "react";
import { ShaderGradient } from "shadergradient";
/*
const Scene = dynamic(() => import("@/components/canvas/scene"), {
  ssr: false,
});

const ShaderGradient = dynamic(
  () => import("shadergradient").then((mod) => mod.ShaderGradient),
  { ssr: false }
);
const View = dynamic(
  () => import("@/components/canvas/view").then((mod) => mod.View),
  {
    ssr: false,
    loading: () => (
      <div className="size-full flex bg-[#EDE6EE] items-center justify-center">
        <svg
          className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    ),
  }
); */

export default function gradient() {
  return (
    <View className="size-full">
      <Suspense fallback={null}>
        <ShaderGradient
          cameraZoom={10}
          zoomOut={true}
          cDistance={0}
          grain="off"
          color1="#ebedff"
          color2="#f3f2f8"
          color3="#dbf8ff"
          brightness={1.2}
        />
        <Common />
      </Suspense>
    </View>
  );
}
