import { Router } from "express";
import { USERS_ENDPOINTS } from "../shared/constants/END_POINTS";
import LawyerController from "../controllers/lawyer-controller";

const lawyerController = new LawyerController()

const {
  LAWYER: {
    CREATE,
    CREATE_PASSWORD,
    GET_ALL,
    GET_DATA,
    UPDATE_LAWYER,
    CREATE_TOKEN,
  }
} = USERS_ENDPOINTS

const LawyerRoutes = Router()

LawyerRoutes.post(CREATE, lawyerController.create)
LawyerRoutes.post(CREATE_PASSWORD, lawyerController.createPassword)
LawyerRoutes.get(GET_ALL, lawyerController.getAll)
LawyerRoutes.get(GET_DATA, lawyerController.getData)
LawyerRoutes.patch(UPDATE_LAWYER, lawyerController.updateLawyer)
// ClientRoutes.post(CREATE_TOKEN, clientController.)

export default LawyerRoutes