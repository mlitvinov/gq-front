"use client";

import ProfilePage from "@/shared/ProfilePage";

export default function Page(params: { params?: { id: number } }) {
  return <ProfilePage {...params} />;
}
