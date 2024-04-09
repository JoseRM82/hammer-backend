import { Request, Response } from "express";

import ClientModel from '../domain/models/client-model'
import LawyerModel from '../domain/models/lawyer-model'
import ChatModel from '../domain/models/chat-model'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";
import MessageModel from "../domain/models/message-model";
import { error } from "console";

export default class ChatController {
  public async createAChat(request: Request, response: Response) {
    try {
      const { user_id, otherPersonId, userType, message } = request.body

      if (userType === 'client') {
        const client = await ClientModel.findOne({ _id: user_id }, {first_name: 1, last_name: 1, _id: 0})
        const lawyer = await LawyerModel.findOne({ _id: otherPersonId }, {first_name: 1, last_name: 1, _id: 0})

        if (!client || !lawyer) return network_error({}, 400, response, 'Invalid user type', COMMON_ERRORS.NO_USER_TYPE)

        const chat = await ChatModel.findOne({ client_id: user_id, lawyer_id: otherPersonId })

        if (!chat) {
          const newChat = new ChatModel({
            client_id: user_id,
            client_name: `${client.last_name}, ${client.first_name}`,
            lawyer_id: otherPersonId,
            lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
            messages: [{
              content: message,
              user_id: user_id,
            }]
          })
          
          const chatCreated = await newChat.save()
          const Chat_Id = chatCreated._id

          return network_success({chatId: Chat_Id}, 200, response, 'Chat created successfully')

        }

        return network_success({chatId: chat._id}, 200, response, 'Chat found!')

      } else if (userType === 'lawyer') {
        const client = await ClientModel.findOne({ _id: otherPersonId })
        const lawyer = await LawyerModel.findOne({ _id: user_id })

        if (!client || !lawyer) {
          return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const chat = await ChatModel.findOne({ client_id: otherPersonId, lawyer_id: user_id })
        
        if (!chat) {
          const newChat = new ChatModel({
            client_id: otherPersonId,
            client_name: `${client.last_name}, ${client.first_name}`,
            lawyer_id: user_id,
            lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
            messages: [{
              content: message,
              user_id: user_id,
            }]
          })
          
          const chatCreated = await newChat.save()
          const Chat_Id = chatCreated._id

          return network_success({chatId: Chat_Id}, 200, response, 'Chat created successfully')

        }

        return network_success({chatId: chat._id}, 200, response, 'Chat found!')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getChats(request: Request, response: Response) {
    try {
      const user_id = request.headers.userid
      const user_type = request.headers.usertype

      if (user_type === 'client') {
        const client = await ClientModel.findOne({ _id: user_id })

        if (!client) return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

        const chats = await ChatModel.find({ client_id: client!._id })

        if(!chats) return network_success([], 200, response, 'There are no chats yet')

        return network_success(chats, 200, response, 'Chats found!')

      } else if (user_type === 'lawyer') {
        const lawyer = await LawyerModel.findOne({ _id: user_id })

        if (!lawyer) return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

        const chats = await ChatModel.find({ lawyer_id: lawyer!._id })

        if(!chats) return network_success([], 200, response, 'There are no chats yet')

        return network_success(chats, 200, response, 'Chats found!')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getMessagesFromAChat(request: Request, response: Response) {
    try {
      const {other_person_id, user_type, own_id} = request.body

      if (user_type === 'client') {
        const client = await ClientModel.findOne({ _id: own_id })
        const lawyer = await LawyerModel.findOne({ _id: other_person_id })
        
        if (!client || !lawyer) {
          return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)
        }

        const chat = await ChatModel.findOne({client_id: client._id, lawyer_id: other_person_id})

        if(!chat) return network_success([], 200, response, 'Chat was no created yet')
        
        return network_success(chat, 200, response, 'Chats found!')

      } else if (user_type === 'lawyer') {
        const lawyer = await LawyerModel.findOne({ _id: own_id })
        const client = await ClientModel.findOne({ _id: other_person_id })

        if (!lawyer || !client) {
          return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)
        }

        const chat = await ChatModel.findOne({ lawyer_id: lawyer._id, client_id: other_person_id })

        if(!chat) return network_success([], 200, response, 'There are no messages yet')

        return network_success(chat, 200, response, 'Chats found!')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }
  
  public async createAMessage(request: Request, response: Response) {
    try {
      const { user_id, message, chat_id} = request.body

      const selectedMessage = await ChatModel.findOne({_id: chat_id})

      if(selectedMessage!.messages[0].content === '') return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      const messageData = {content: message, user_id: user_id}
      const sentMessage = await ChatModel.updateOne({_id: chat_id}, {$set: {'messages': [...selectedMessage!.messages!, messageData]}})

      if(!sentMessage) return network_error({}, 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

      return network_success(messageData, 200, response, 'Message sent successfully!')

    } catch(error) {
      return server_error(500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }
}
