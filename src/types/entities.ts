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
