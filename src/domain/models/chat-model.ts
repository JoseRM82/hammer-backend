import { Schema, model, Model } from "mongoose";
import ChatRepository from "../repository/chat-repository";

const Chat = new Schema<ChatRepository, Model<ChatRepository>>({
  client_id: { type: String },
  client_name: { type: String },
  lawyer_id: { type: String },
  lawyer_name: { type: String },
})

export default model('Chats', Chat)