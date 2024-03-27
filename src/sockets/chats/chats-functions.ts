import ClientModel from "../../domain/models/client-model"
import LawyerModel from "../../domain/models/lawyer-model"
import ChatModel from "../../domain/models/chat-model"

export const createAChat = async(data: Record<string, any>) => {
  try {
    const {user_id, otherPersonId, user_type, message} = data

    if (user_type === 'client') {
      const client = await ClientModel.findOne({ _id: user_id }, {first_name: 1, last_name: 1, _id: 0})
      const lawyer = await LawyerModel.findOne({ _id: otherPersonId }, {first_name: 1, last_name: 1, _id: 0})

      if (!client || !lawyer) return {success: false, data: {chatId: ''}}

      const chat = await ChatModel.findOne({ client_id: client._id, lawyer_id: otherPersonId })

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

        const response = {
          success: true, 
          data: {
            chatId: Chat_Id, 
            client_id: user_id, 
            client_name: `${client.last_name}, ${client.first_name}`,
            lawyer_id: otherPersonId,
            lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
          }
        }

        return response
      }

      const response = {
        success: true, 
        data: {
          chatId: chat._id, 
          client_id: user_id, 
          client_name: `${client.last_name}, ${client.first_name}`,
          lawyer_id: otherPersonId,
          lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
        }
      }

      return response

    } else if (user_type === 'lawyer') {
      const client = await ClientModel.findOne({ _id: otherPersonId })
      const lawyer = await LawyerModel.findOne({ _id: user_id })

      if (!client || !lawyer) {
        return {success: false, data: {chatId: ''}}
      }

      const chat = await ChatModel.findOne({ client_id: otherPersonId, lawyer_id: lawyer._id })

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

        const response = {
          success: true, 
          data: {
            chatId: Chat_Id, 
            client_id: user_id, 
            client_name: `${client.last_name}, ${client.first_name}`,
            lawyer_id: otherPersonId,
            lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
            messages: [...chatCreated.messages]
          }
        }

        return response
      }

      const response = {
        success: true, 
        data: {
          chatId: chat._id, 
          client_id: user_id, 
          client_name: `${client.last_name}, ${client.first_name}`,
          lawyer_id: otherPersonId,
          lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
          messages: [...chat.messages]
        }
      }

      return response
    }

    return {success: false, data: {chatId: ''}}

  } catch (error) {
    return {success: false, data: {chatId: ''}}
  }
}

export const createAMessage = async(data: Record<string, any>) => {
  try {
    const {message, user_type, user_id, chat_id} = data
    const selectedChat = await ChatModel.findOne({_id: chat_id})

    if(selectedChat!.messages[0]!.content! === '') return {success: false}

    const messageData = {content: message, user_id: user_id}
    const sentMessage = await ChatModel.updateOne({_id: chat_id}, {$set: {'messages': [...selectedChat!.messages!, messageData]}})

    if(!sentMessage) return {success: false}

    const responseData = {otherPersonId: user_type === 'client' ? selectedChat!.lawyer_id : selectedChat!.client_id}

    return {success: true, data: responseData}

  } catch(error) {
    return {success: false}
  }
}