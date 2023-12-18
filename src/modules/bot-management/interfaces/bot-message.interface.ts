export interface BotMessage {
  update_id: number;
  message: Message;
}
interface Message {
  message_id: number;
  from: From;
  chat: Chat;
  date: number;
  text: string;
}
export interface Chat {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  type: string;
}
interface From {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
}
