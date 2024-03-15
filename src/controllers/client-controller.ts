import { Request, Response } from "express";

import ClientModel from "../domain/models/client-model";
import { encrypt } from '../shared/utils/crypt'
import JWTauth from '../middlewares/JWTauth'
import createJWT from '../shared/utils/createJWT'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";

export default class ClientController {
  public async create(request: Request, response: Response) {
    try {
      const { first_name, last_name, email } = request.body as RequestBody

      type RequestBody = {
        first_name: string;
        last_name: string;
        email: string;
      }

      const emailExists = await ClientModel.findOne({ email: email })

      if (emailExists) {
        return network_error({}, 11000, response, '', COMMON_ERRORS.ALREADY_EXIST)

      } else {
        const client = new ClientModel({
          first_name: first_name,
          last_name: last_name,
          email: email,
          user_type: 'client',
        })

        await client.save()

        const token = await createJWT(client._id, first_name, last_name, email)

        const newClient = await ClientModel.findOneAndUpdate(
          { _id: client._id },
          { token: token },
          { new: true, },
        )

        return network_success(
          newClient,
          200,
          response,
          'Client created successfully'
        )
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async createPassword(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const { password } = request.body
      const client = await ClientModel.find({ token: token })

      if (!client) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

      } else {
        const encryptedPassword = encrypt(password)

        const newPasswordClient = await ClientModel.findOneAndUpdate(
          { token: token },
          { password: encryptedPassword },
          { new: true },
        )

        return network_success(
          newPasswordClient,
          200,
          response,
          'Client password has been set successfully'
        )
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getAll(request: Request, response: Response) {
    try {
      const { } = JWTauth(request)
      const clients = await ClientModel.find()

      return network_success(
        clients,
        200,
        response,
        'Clients found'
      )

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getData(request: Request, response: Response) {
    try {
      const token = request.params
      const client = await ClientModel.findOne({token: token})

      if (!client) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

      }

      const data = {name: client.first_name, last_name: client.last_name}

      return network_success(
        data,
        200,
        response,
        'Sent client data'
      )

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async updateClient(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const { userData } = request.body
      const client = await ClientModel.findOne({ token: token })

      if (!client) {
        return response.send({
          message: 'Client not found',
          success: false,
        })

      } else {

        const newCompleteClient = await ClientModel.findOneAndUpdate(
          { _id: client._id },
          { data: userData },
          { new: true }
        )

        return network_success(
          newCompleteClient,
          200,
          response,
          'Client data has been added successfully'
        )
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }
}