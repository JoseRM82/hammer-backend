import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

import LawyerModel from "../domain/models/lawyer-model";
import { encrypt } from '../shared/utils/crypt'
import JWTauth from '../middlewares/JWTauth'
import createJWT from '../shared/utils/createJWT'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { ERROR_CODES } from "../shared/constants/ERROR_CODES";
import {error} from 'console'
import lawyerModel from "../domain/models/lawyer-model";

export default class LawyerController {
  public async createToken(request: Request, response: Response) {
    try {
      const { first_name, last_name, email, password } = request.body 
      const uid = uuidv4()

      const token = await createJWT(uid, first_name, last_name, email, password)

      return network_success(
        token,
        200,
        response,
        'Lawyer main info created'
      )

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async validateEmail(request: Request, response: Response) {
    try {
      const email = request.body

      const userExist = await lawyerModel.find({email: email})

      if(userExist) return network_error('Lawyer email already exist', 500, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      network_success('', 200, response, 'Lawyer email available to use')

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async createUser(request: Request, response: Response) {
    try {
      const userData = request.body

      const lawyer = new LawyerModel(userData)

      const lawyerCreated = await lawyer.save()

      if(!lawyerCreated) return server_error(500, response, '', ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

      const lawyer_id = await lawyerModel.findOne({email: userData.email})

      return network_success(lawyer_id, 200, response, 'Lawyer successfully created')

    } catch(error) {
      return server_error(500, response, '', ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }
 
  public async getAll(request: Request, response: Response) {
    try {
      const lawyers = await LawyerModel.find()

      return network_success(lawyers, 200, response, 'Lawyers found')

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getData(request: Request, response: Response) {
    try {
      const token = request.params
      const lawyer = await LawyerModel.findOne({token: token})

      if (!lawyer) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      const data = {name: lawyer.first_name, last_name: lawyer.last_name}

      return network_success(data, 200, response, 'Sent lawyer data')

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async updateLawyer(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const { userData } = request.body
      const lawyer = await LawyerModel.findOne({ token: token })

      if (!lawyer) {
        return response.send({
          message: 'Client not found',
          success: false,
        })

      } else {

        console.log('newCompleteLawyer: ', LawyerModel.findOne({ _id: lawyer._id }))
        const newCompleteLawyer = await LawyerModel.findOneAndUpdate(
          { _id: lawyer._id },
          { data: userData },
          { new: true }
        )

        return network_success(
          newCompleteLawyer,
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