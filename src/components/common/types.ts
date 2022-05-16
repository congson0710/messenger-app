export type User = {
  name: string;
  id: string;
};

export type Message = {
  id: string;
  text: string;
  sender: User;
  ts: string;
};

export type Messages = {
  cursor_next: string;
  cursor_prev: string;
  sort: string;
  rows: Message[];
};

export type Conversation = {
  id: string;
  lastMessage: Message;
  participants: User[];
};

export type Conversations = {
  cursor_next: string;
  cursor_prev: string;
  sort: string;
  rows: Conversation[];
};
