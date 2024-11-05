export type Challenge = {
  id: number;
  description: string;
  achievementTitle?: string;
  achievementPicsUrl?: string;
  promoAchievementTitle?: string;
  promoAchievementPicsUrl?: string;
  price: number;
  status: string;
  senderUserName?: string;
  receiverUserName?: string;
  videoUrl?: string | null;
  taskUrl?: string;
};

// Добавляем новый тип данных для целей
export type Goal = {
  id: number;
  description: string;
  picUrl: string;
  name: string;
  targetCount: number;
  currentCount: number;
  status: string;
  rewardPoints: number;
  completionCount?: number;
  currentTargetCount?: number;
};
