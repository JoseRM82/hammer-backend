import { Request, Response } from "express";

import ChatModel from "../domain/models/chat-model";
import ClientModel from "../domain/models/client-model";
import LawyerModel from "../domain/models/lawyer-model";
import MessageModel from "../domain/models/message-model";
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";

export default class MessageController {
  public async create(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const { message, userType, chat_id } = request.body

      if (userType === 'client') {
        const client = await ClientModel.findOne({ token: token })

        if (!client) {
          network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const chat = await ChatModel.findOne({ _id: chat_id })

        if (!chat) {
          network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const newMessage = new MessageModel({
          chat_id: chat_id,
          user_id: client?._id,
          message_content: message,
          created_at: new Date(),
          readed: false,
        })

        await newMessage.save()

        network_success(newMessage, 200, response, 'Message created successfully')

      } else if (userType === 'lawyer') {
        const lawyer = await LawyerModel.findOne({ token: token })

        if (!lawyer) {
          network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const chat = await ChatModel.findOne({ _id: chat_id })

        if (!chat) {
          network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const newMessage = new MessageModel({
          chat_id: chat_id,
          user_id: lawyer?._id,
          user_name: `${lawyer?.last_name}, ${lawyer?.first_name}`,
          message_content: message,
          created_at: new Date(),
          readed: false,
        })

        await newMessage.save()

        network_success(newMessage, 200, response, 'Message created successfully')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getChatMessages(request: Request, response: Response) {
    try {
      const chat_id = request.headers.chatid
      const user_type = request.headers.usertype

      if (user_type === 'client') {

        const messages = await MessageModel.find({ chat_id: chat_id })

        if(!messages) return network_success([], 200, response, 'There are no messages yet')

        return network_success(messages, 200, response, 'Messages getted successfully')

      } else if (user_type === 'lawyer') {

        const messages = await MessageModel.find({ chat_id: chat_id })

        if(!messages) return network_success([], 200, response, 'There are no messages yet')

        return network_success(messages, 200, response, 'Messages getted successfully')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async setReadedMessages(request: Request, response: Response) {
    try {
      const { chat_id } = request.body

      const chatsReaded = await MessageModel.find({ chat_id: chat_id })

      const updatedMessages = chatsReaded.map(async x => {
        await x.updateOne(
          { readed: true },
        )
      })

      return network_success(updatedMessages, 200, response, 'Messages marked as readed')

    } catch (error) {
      return server_error(500, response, error)
    }
  }
}