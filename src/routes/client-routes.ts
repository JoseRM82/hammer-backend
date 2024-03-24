import { Router } from "express";
import { USERS_ENDPOINTS } from "../shared/constants/END_POINTS";
import ClientController from "../controllers/client-controller";

const clientController = new ClientController()

const {
  CLIENT: {
    CREATE_TOKEN,
    CREATE_USER,
    VALIDATE_EMAIL,
    GET_ALL,
    GET_DATA,
    UPDATE_CLIENT,
  }
} = USERS_ENDPOINTS

const ClientRoutes = Router()

ClientRoutes.post(CREATE_TOKEN, clientController.createToken)
ClientRoutes.post(VALIDATE_EMAIL, clientController.validateEmail)
ClientRoutes.post(CREATE_USER, clientController.createUser)
ClientRoutes.get(GET_ALL, clientController.getAll)
ClientRoutes.get(GET_DATA, clientController.getData)
ClientRoutes.patch(UPDATE_CLIENT, clientController.updateClient)
// ClientRoutes.post(CREATE_TOKEN, clientController.)

export default ClientRoutes