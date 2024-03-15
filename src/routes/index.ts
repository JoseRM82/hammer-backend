import { Express } from 'express'
import ClientRoutes from './client-routes'
import LawyerRoutes from './lawyer-routes'
import CaseRoutes from './case-routes'
import RequestRoutes from './request-routes'
import AuthRoutes from './auth-routes'
import MessageRoutes from './message-routes'
import ChatRoutes from './chat-routes'
import CitationRoutes from './citation-routes'

const registryRoutes = (server: Express) => {
  server.use(ClientRoutes)
  server.use(LawyerRoutes)
  server.use(CaseRoutes)
  server.use(RequestRoutes)
  server.use(AuthRoutes)
  server.use(MessageRoutes)
  server.use(ChatRoutes)
  server.use(CitationRoutes)
  return;
}

export default registryRoutes