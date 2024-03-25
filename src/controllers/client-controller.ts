import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import ClientModel from "../domain/models/client-model";
import { encrypt } from '../shared/utils/crypt'
import JWTauth from '../middlewares/JWTauth'
import createJWT from '../shared/utils/createJWT'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";

export default class ClientController {
  public async createToken(request: Request, response: Response) {
    try {
      const { first_name, last_name, email, password } = request.body 
      const uid = uuidv4()

      const token = await createJWT(uid, first_name, last_name, email, password)

      return network_success(
        token,
        200,
        response,
        'Client main info created'
      )

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async validateEmail(request: Request, response: Response) {
    try {
      const email = request.body.email
      const userExist = await ClientModel.findOne({email: email})
      
      if(userExist) return network_error('Client email already exist', 500, response, '', COMMON_ERRORS.ALREADY_EXIST)
    
      return network_success({}, 200, response, 'Client email available to use')
    
  } catch (error) {
      return server_error(500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }

  public async createUser(request: Request, response: Response) {
    try {
      const userData = request.body
      const encryptedPass = encrypt(userData.password)

      const newUserData = {...userData, password: encryptedPass}

      const client = new ClientModel(newUserData)

      const clientCreated = await client.save()

      if(!clientCreated) return server_error(500, response, '', ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

      const newClient = await ClientModel.findOne({email: userData.email})

      return network_success(newClient?._id, 200, response, 'Client successfully created')

    } catch(error) {
      return server_error(500, response, '', ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
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