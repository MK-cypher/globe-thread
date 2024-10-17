export type MessagesType = {
  id: string;
  created_at: string;
  updated_at: string | null;
  conversation_id?: string;
  from: string;
  to?: string;
  text: string;
  reply_to?: string;
  public_id?: string;
  to_user?: {
    username: string;
    avatar: string;
  };
  from_user: {
    username: string;
    avatar: string;
  };
  reply_content?: {
    text: string;
    reply_user: {
      username: string;
      avatar: string;
    };
  };
};

export type PostType = {
  id: number;
  created_at: string;
  created_by: string;
  title: string;
  description: string;
  img?: string;
  price?: number;
  price_type?: string;
  type: string;
  users: {
    username: string;
    avatar: string;
  };
};
