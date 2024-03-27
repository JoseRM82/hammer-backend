import { Router } from "express";
import { CHAT } from "../shared/constants/END_POINTS";
import ChatController from "../controllers/chat-controller";

const chatController = new ChatController()

const {
  CREATE_A_CHAT,
  GET_CHATS,
  GET_MESSAGES_FROM_A_CHAT,
} = CHAT

const ChatRoutes = Router()

ChatRoutes.post(CREATE_A_CHAT, chatController.createAChat)
ChatRoutes.get(GET_CHATS, chatController.getChats)
ChatRoutes.post(GET_MESSAGES_FROM_A_CHAT, chatController.getMessagesFromAChat)

export default ChatRoutes