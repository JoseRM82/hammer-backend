import { Schema, model, Model, SchemaTypes } from "mongoose";
import ChatRepository from "../repository/chat-repository";

const Chat = new Schema<ChatRepository, Model<ChatRepository>>({
  client_id: { type: String },
  client_name: { type: String },
  lawyer_id: { type: String },
  lawyer_name: { type: String },
  messages: { type: SchemaTypes.Mixed }
})

export default model('Chats', Chat)