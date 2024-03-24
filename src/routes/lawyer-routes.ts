import { Router } from "express";
import { USERS_ENDPOINTS } from "../shared/constants/END_POINTS";
import LawyerController from "../controllers/lawyer-controller";

const lawyerController = new LawyerController()

const {
  LAWYER: {
    CREATE_TOKEN,
    CREATE_USER,
    VALIDATE_EMAIL,
    GET_ALL,
    GET_DATA,
    UPDATE_LAWYER,
  }
} = USERS_ENDPOINTS

const LawyerRoutes = Router()

LawyerRoutes.post(CREATE_TOKEN, lawyerController.createToken)
LawyerRoutes.post(CREATE_USER, lawyerController.createUser)
LawyerRoutes.post(VALIDATE_EMAIL, lawyerController.validateEmail)
LawyerRoutes.get(GET_ALL, lawyerController.getAll)
LawyerRoutes.get(GET_DATA, lawyerController.getData)
LawyerRoutes.patch(UPDATE_LAWYER, lawyerController.updateLawyer)
// ClientRoutes.post(CREATE_TOKEN, clientController.)

export default LawyerRoutes