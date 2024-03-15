import { Router } from "express";
import { USERS_ENDPOINTS } from "../shared/constants/END_POINTS";
import ClientController from "../controllers/client-controller";

const clientController = new ClientController()

const {
  CLIENT: {
    CREATE,
    CREATE_PASSWORD,
    GET_ALL,
    GET_DATA,
    UPDATE_CLIENT,
    CREATE_TOKEN,
  }
} = USERS_ENDPOINTS

const ClientRoutes = Router()

ClientRoutes.post(CREATE, clientController.create)
ClientRoutes.post(CREATE_PASSWORD, clientController.createPassword)
ClientRoutes.get(GET_ALL, clientController.getAll)
ClientRoutes.get(GET_DATA, clientController.getData)
ClientRoutes.patch(UPDATE_CLIENT, clientController.updateClient)
// ClientRoutes.post(CREATE_TOKEN, clientController.)

export default ClientRoutes