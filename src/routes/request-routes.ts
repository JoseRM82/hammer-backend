import { Router } from "express";
import { REQUEST } from '../shared/constants/END_POINTS'
import RequestController from "../controllers/request-controller";

const requestController = new RequestController()

const {
  CREATE,
  DELETE,
  GET_CLIENT_REQUESTS,
  GET_LAWYER_REQUESTS,
  // GET_BY_USER_ID,
} = REQUEST

const RequestRoutes = Router()

RequestRoutes.post(CREATE, requestController.create)
RequestRoutes.post(DELETE, requestController.deleteRequest)
RequestRoutes.get(GET_CLIENT_REQUESTS, requestController.getClientRequests)
RequestRoutes.get(GET_LAWYER_REQUESTS, requestController.getLawyerRequests)
// RequestRoutes.get(GET_BY_USER_ID, requestController.getByUserId)

export default RequestRoutes