"use client";

import ProfilePage from "@/pages/ProfilePage";

export default function Page(params: { params?: { username: string } }) {
  return <ProfilePage {...params} />;
}
