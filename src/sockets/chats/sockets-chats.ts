import { Socket, Server } from "socket.io";

import { createAChat, createAMessage } from "./chats-functions";
import { ConnectedUsers } from "../connected-users";

export const createMessageSocket = (socket: Socket, io: Server) => {
  socket.on('sendMessage', (data: Record<string, any>) => {

    const sendMessage = () => {
      io.sockets.sockets.forEach(socketItem => {
        
        if(!ConnectedUsers.getSocketIdByUserId(data.other_person_id)) return console.log('1')

        if(socketItem.id === ConnectedUsers.getSocketIdByUserId(data.other_person_id)) {
          socketItem.emit('sentMessage', {content: data.message, user_id: data.user_id})
          console.log('here')
        }
      })
    }

    sendMessage()
    createAMessage(data)
      .then(res => {
        if(!res.success) return
      })
  })
}

export const createChatSocket = (socket: Socket, io: Server) => {
  socket.on('createChat', (dataFromFrontend: Record<string, any>) => {
    
    const sendChatId = (data: Record<string, any>) => {
      io.sockets.sockets.forEach(socketItem => {
        if(!ConnectedUsers.getSocketIdByUserId(data.otherPersonId)) return

        if(socketItem.id === ConnectedUsers.getSocketIdByUserId(data.otherPersonId)) {
          socketItem.emit('chatCreated', data)
          return
        }
      })
    }

    createAChat(dataFromFrontend)
      .then(res => {
        if(!res.success) return

        socket.emit('createChatCompleted', res.data.chatId)
        sendChatId(res.data)
      })
  })
}