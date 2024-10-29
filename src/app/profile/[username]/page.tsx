"use client";

import ProfilePage from "@/shared/ProfilePage";

export default function Page(params: { params?: { username: string } }) {
  return <ProfilePage {...params} />;
}
