import { Socket, Server } from "socket.io";

import { ConnectedUsers } from "../connected-users";
import { createCitation } from "./citations-functions";

export const createCitationSocket = (socket: Socket, io: Server) => {
  socket.on('createCitation', (data: Record<string, any>) => {

    const sendCitation = () => {
      io.sockets.sockets.forEach(socketItem => {
        
        if(!ConnectedUsers.getSocketIdByUserId(data.other_person_id)) return console.log('1')

        if(socketItem.id === ConnectedUsers.getSocketIdByUserId(data.other_person_id)) {
          socketItem.emit('sentCitation', {note: data.note, date: data.date})
        }
      })
    }

    sendCitation()
    createCitation(data)
      .then(res => {
        if(!res.success) return
      })
  })
}