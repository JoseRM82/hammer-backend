import { Router } from "express";
import { MESSAGE } from "../shared/constants/END_POINTS";
import MessageController from "../controllers/message-controller";

const messageController = new MessageController()

const {
  CREATE,
  GET_MESSAGES,
  SET_READED_MESSAGES,
} = MESSAGE

const MessageRoutes = Router()

MessageRoutes.post(CREATE, messageController.create)
MessageRoutes.get(GET_MESSAGES, messageController.getChatMessages)
MessageRoutes.post(SET_READED_MESSAGES, messageController.setReadedMessages)

export default MessageRoutes