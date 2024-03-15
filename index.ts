import { Request, Response } from "express"
import http from 'http'

import dbConnection from "./config/database"
import { enableEnviroments } from "./config"
import registryRoutes from "./src/routes"

require('dotenv').config()
const express = require('express')
const cors = require('cors')
// const { Server } = require('socket.io')

enableEnviroments()
dbConnection()

const app = express()
app.use(express.json())
app.use(cors())
registryRoutes(app)

app.get('/', (req: Request, res: Response) => {
  res.send("Now you're connected to vercel")
})

const server = http.createServer(app)
// const io = new Server(server)

// io.on('connection', () => {
//   console.log('connection started')
// })

server.listen(process.env.PORT, () => {
  console.log('Server on port', process.env.PORT)
})