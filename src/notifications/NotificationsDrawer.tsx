"use client";

import React from "react";
import Drawer from "@/components/ui/drawer";
import { Notification } from "@/types/entities";
import { useTranslations } from "next-intl";
import { Link } from "@/components/Link/Link";
import { BASE_URL } from "@/lib/const";

type NotificationsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
};

export function NotificationsDrawer({ isOpen, onClose, notifications, unreadCount }: NotificationsDrawerProps) {
  const t = useTranslations("notifications");

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full">
        <header className="px-4 py-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {t("you-have")} {unreadCount} {t("new-notifications")}
          </h2>
        </header>
        <div className="flex-grow overflow-y-auto">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`px-4 py-2 border-b border-gray-200 ${
                    notification.read ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <Link href={notification.pageUrl}>
                    <div className="flex items-center">
                      {notification.imageUrl && (
                        <img
                          width={50}
                          height={50}
                          src={`${BASE_URL}/api/images/${notification.imageUrl}`}
                          alt=""
                          className="w-8 h-8 mr-2 rounded-full"
                        />
                      )}
                      <div>

                        <p
                          className="text-sm font-semibold">                      {notification.friendId && notification.friendName ? (
                          <Link
                            href={`/profile/${notification.friendId}`}
                            className="font-semibold text-black no-underline mr-2"
                          >{t("from")} {notification.friendName}: </Link>
                        ) : null}{notification.title}</p>
                        <p className="text-sm">{notification.description}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-2">{t("no-notifications")}</p>
          )}
        </div>
      </div>
    </Drawer>
  );
}
