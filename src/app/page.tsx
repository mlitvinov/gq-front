"use client";

import { redirect } from "next/navigation";

import { useLayoutEffect } from "react";

export default function Home() {
  useLayoutEffect(() => {
    redirect("/friends");
  }, []);

  return null;
}
