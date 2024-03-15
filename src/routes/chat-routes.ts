import { Router } from "express";
import { CHAT } from "../shared/constants/END_POINTS";
import ChatController from "../controllers/chat-controller";

const chatController = new ChatController()

const {
  GET_OR_CREATE_A_CHAT,
  GET_CHATS,
  GET_A_CERTAIN_CHAT,
} = CHAT

const ChatRoutes = Router()

ChatRoutes.post(GET_OR_CREATE_A_CHAT, chatController.getOrCreateAChat)
ChatRoutes.get(GET_CHATS, chatController.getChats)
ChatRoutes.get(GET_A_CERTAIN_CHAT, chatController.getACertainChat)

export default ChatRoutes