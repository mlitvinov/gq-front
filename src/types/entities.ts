export type User = {
  friendId: string;
  picsUrl: string;
  rating: number;
  username: string;
  userId: string;
};

export type Friend = {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  status: string;
  createdAt: string;
};

export type Achievement = {
  userAchievement: number | null;
  name: string;
  imageUrl: string;
};

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
  senderId: number;
  receiverUserName?: string;
  receiverId: number;
  videoUrl?: string | null;
  taskUrl?: string;
};

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

export interface ChallengeData {
  id: number;
  description: string;
  videoUrl: string | null;
  price: number;
  sender: string;
  senderId: number;
}
