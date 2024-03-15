import { Router } from "express";
import { AUTH } from '../shared/constants/END_POINTS'
import AuthController from "../controllers/auth-controller";

const authController = new AuthController()

const {
  LOGIN,
  GET_OWN_ID
} = AUTH

const AuthRoutes = Router()

AuthRoutes.post(LOGIN, authController.login)
AuthRoutes.get(GET_OWN_ID, authController.getOwnId)

export default AuthRoutes