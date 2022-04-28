export type UserType = {
  name: string;
  id: number;
  email: string | undefined;
};

type LastMessageType = {
  id: string;
  createdAt: string;
  text: string;
  sender: UserType;
};

export type ConversationRowType = {
  id: string;
  lastMessage: LastMessageType;
  participants: UserType[];
};

export type ConversationType = {
  cursor_next: string;
  cursor_prev: string;
  sort: string;
  rows: ConversationRowType[];
};
