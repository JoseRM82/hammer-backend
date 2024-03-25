import { Request, Response } from "express";
import ClientModel from "../domain/models/client-model";
import LawyerModel from "../domain/models/lawyer-model";
import { network_error, network_success, server_error } from "../middlewares/network-middleware";
import { COMMON_ERRORS, ERROR_CODES, USER_ERRORS } from "../shared/constants/ERROR_CODES";

import USER_TYPES from '../shared/constants/USER-TYPES'
import { comparePassword } from "../shared/utils/crypt";
import { error } from "console";

export default class AuthController {
  public async login(request: Request, response: Response) {
    try {
      const { email, password, userType } = request.body

      try {
        if (userType === USER_TYPES.client) {
          const client = await ClientModel.findOne({ email: email })

          if (!client) {
            return network_error({}, 400, response, error, USER_ERRORS.PASSWORD_ERROR)

          } else {
            const validatePassword = comparePassword(client.password, password)

            if (!validatePassword) {
              return network_error('Client does not exist', 400, response, error, USER_ERRORS.PASSWORD_ERROR)

            } else {
              const logedClient = {token: client.token, name: client.first_name, last_name: client.last_name, _id: client._id}
              return network_success(logedClient, 200, response, 'Welcome')
            }
          }

        } else if (userType === USER_TYPES.lawyer) {
          const lawyer = await LawyerModel.findOne({ email: email })

          if (!lawyer) {
            return network_error({}, 400, response, "Lawyer doesn't exist", USER_ERRORS.PASSWORD_ERROR)

          } else {
            const validatePassword = comparePassword(lawyer.password!, password)

            if (!validatePassword) {
              return network_error({}, 400, response, 'Lawyer does not exist', USER_ERRORS.PASSWORD_ERROR)

            } else {
              const logedLawyer = {token: lawyer.token, name: lawyer.first_name, last_name: lawyer.last_name, _id: lawyer._id}
              return network_success(logedLawyer, 200, response, 'Welcome')
            }
          }

        } else {
          return network_error({}, 400, response, 'The user type is incorrect', COMMON_ERRORS.NO_USER_TYPE)
        }

      } catch (error) {
        return network_error({}, 400, response, '')
      }

    } catch (error) {
      return server_error(500, response, '', ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }

  public async getOwnId(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const userType = request.headers.usertype

      if (userType === 'client') {
        const client = await ClientModel.findOne({ token: token })

        if (!client) {
          return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        return network_success(client._id, 200, response, 'ID getted successfully')

      } else if (userType === 'lawyer') {
        const lawyer = await LawyerModel.findOne({ token: token })

        if (!lawyer) {
          return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        return network_success(lawyer._id, 200, response, 'ID getted successfully')

      }

      return network_error({}, 400, response, '', COMMON_ERRORS.NO_USER_TYPE)

    } catch (error) {
      return server_error(500, response, error)
    }
  }
}