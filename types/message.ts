export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  editedAt?: Date;
  citedMsgId?: string;
  isBlocked: boolean;
}

export interface MessageInput {
  text: string;
  chatId: string;
  citedMsgId?: string;
}