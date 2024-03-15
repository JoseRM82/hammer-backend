export default interface MessageRepository {
  chat_id: string;
  user_id: string;
  message_content: string;
  created_at: Date;
  readed: boolean;
}