import { Request, Response } from "express";

import LawyerModel from "../domain/models/lawyer-model";
import { encrypt } from '../shared/utils/crypt'
import JWTauth from '../middlewares/JWTauth'
import createJWT from '../shared/utils/createJWT'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { ERROR_CODES } from "../shared/constants/ERROR_CODES";
import { error } from "console";

export default class LawyerController {
  public async create(request: Request, response: Response) {
    try {
      const { first_name, last_name, email } = request.body as RequestBody

      type RequestBody = {
        first_name: string;
        last_name: string;
        email: string;
      }

      const emailExists = await LawyerModel.findOne({ email: email })

      if (emailExists) {
        return response.send({
          message: 'Email is already in use',
          success: false,
        })

      } else {
        const lawyer = new LawyerModel({
          first_name: first_name,
          last_name: last_name,
          email: email,
          user_type: 'lawyer',
        })

        await lawyer.save()

        const token = await createJWT(lawyer._id, first_name, last_name, email)

        const newLawyer = await LawyerModel.findOneAndUpdate(
          { _id: lawyer._id },
          { token: token },
          { new: true, },
        )

        console.log('newLawyer: ', newLawyer)

        return network_success(
          newLawyer,
          200,
          response,
          'Lawyer main info created'
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
      const lawyer = await LawyerModel.find({ token: token })
      console.log('email para pass: ', lawyer![0].email)

      if (!lawyer) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

      } else {
        const encryptedPassword = encrypt(password)

        console.log('newPasswordLawyer: ', LawyerModel.findOne({ _id: lawyer[0]._id }))
        const newPasswordLawyer = await LawyerModel.findOneAndUpdate(
          { _id: lawyer[0]._id },
          { password: encryptedPassword },
          { new: true },
        )
        console.log('newPasssssssssss: ', newPasswordLawyer)

        return network_success(newPasswordLawyer, 200, response, 'Password successfully created')
      }

    } catch (error) {
      return server_error(500, response, error)
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