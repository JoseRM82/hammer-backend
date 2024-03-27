export default interface ChatRepository {
  client_id: string;
  client_name: string;
  lawyer_id: string;
  lawyer_name: string;
  messages: Messages[];
}

export interface Messages {
  content: string;
  user_id: string;
}