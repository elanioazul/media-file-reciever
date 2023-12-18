export interface ITelegramAccount {
  id: number;

  chat_id: string;

  username: string;

  first_name: string;

  last_name: string;

  type: string;

  isNewlyCreated: boolean;
}
