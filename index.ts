import http from 'http'

import dbConnection from "./config/database"
import { enableEnviroments } from "./config"
import registryRoutes from "./src/routes"
// import {createServer} from 'https'

require('dotenv').config()
import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { Server } from 'socket.io'
import { createChatSocket, createMessageSocket } from './src/sockets/chats/sockets-chats'
import { ConnectedUsers } from './src/sockets/connected-users'

enableEnviroments()
dbConnection()

const app = express()
app.use(express.json())
app.use(cors())
app.use(fileUpload())
registryRoutes(app)
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'https://hammerfront.vercel.app',
  }
})

server.listen(process.env.PORT, () => {
  console.log('Server on port', process.env.PORT)
})

io.on('connection', (socket) => {
  socket.on('sentId', (userId: string) => {
    console.log('sentID', userId)
    ConnectedUsers.setSocketId(userId, socket.id);
    console.log('connectedUsers3: ', ConnectedUsers.getAll())
  })
  
  socket.on('disconection', () => {
    const ownSocketId = socket.id

    ConnectedUsers.removeConnectedUserBySocketId(ownSocketId)
  })

  createMessageSocket(socket, io)
  createChatSocket(socket, io)
})