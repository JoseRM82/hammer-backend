import { Schema, model, Model } from "mongoose";
import MessageRepository from "../repository/message-repository";

const Message = new Schema<MessageRepository, Model<MessageRepository>>({
  chat_id: { type: String },
  user_id: { type: String },
  message_content: { type: String },
  created_at: { type: Date },
  readed: { type: Boolean },
})

export default model('Messages', Message)