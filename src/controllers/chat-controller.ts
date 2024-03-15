import { Request, Response } from "express";

import ClientModel from '../domain/models/client-model'
import LawyerModel from '../domain/models/lawyer-model'
import ChatModel from '../domain/models/chat-model'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";
import MessageModel from "../domain/models/message-model";

export default class ChatController {
  public async getOrCreateAChat(request: Request, response: Response) {
    try {
      // const token = request.headers.authorization
      const { id, userType, token } = request.body

      if (userType === 'client') {
        const client = await ClientModel.findOne({ token: token })
        const lawyer = await LawyerModel.findById(id)

        if (!client || !lawyer) {
          return network_error({}, 400, response, 'C', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

        }

        const chat = await ChatModel.findOne({ client_id: client._id, lawyer_id: id })

        if (!chat) {
          const newChat = new ChatModel({
            client_id: client._id,
            client_name: `${client.last_name}, ${client.first_name}`,
            lawyer_id: lawyer._id,
            lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
          })

          await newChat.save()

          return network_success(newChat, 200, response, 'Chat created successfully')

        }

        return network_success(chat, 200, response, 'Chat found!')

      } else if (userType === 'lawyer') {
        const client = await ClientModel.findOne({ _id: id })
        const lawyer = await LawyerModel.findOne({ token: token })

        if (!client || !lawyer) {
          return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const chat = await ChatModel.findOne({ client_id: id, lawyer_id: lawyer._id })

        if (!chat) {
          const newChat = new ChatModel({
            client_id: client._id,
            client_name: `${client.last_name}, ${client.first_name}`,
            lawyer_id: lawyer._id,
            lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
          })

          await newChat.save()

          return network_success(newChat, 200, response, 'Chat created successfully')

        }

        return network_success(chat, 200, response, 'Chat found!')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getChats(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const userType = request.headers.usertype

      if (userType === 'client') {
        const client = await ClientModel.findOne({ token: token })

        if (!client) {
          network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const chats = await ChatModel.find({ client_id: client!._id })

        return network_success(chats, 200, response, 'Chats found!')

      } else if (userType === 'lawyer') {
        const lawyer = await LawyerModel.findOne({ token: token })

        if (!lawyer) {
          network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const chats = await ChatModel.find({ lawyer_id: lawyer!._id })

        return network_success(chats, 200, response, 'Chats found!')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getACertainChat(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const userType = request.headers.usertype
      const otherPersonId = request.headers.id

      if (userType === 'client') {
        const client = await ClientModel.findOne({ token: token })
        
        if (!client) {
          network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const chat = await ChatModel.findOne({client_id: client?._id, lawyer_id: otherPersonId})
        
        return network_success(chat, 200, response, 'Chats found!')

      } else if (userType === 'lawyer') {
        const lawyer = await LawyerModel.findOne({ token: token })

        if (!lawyer) {
          network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const chat = await ChatModel.findOne({ lawyer_id: lawyer!._id, client_id: otherPersonId })

        return network_success(chat, 200, response, 'Chats found!')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }
}