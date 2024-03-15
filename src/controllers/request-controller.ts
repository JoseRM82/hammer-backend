import { Request, Response } from "express";

import ClientModel from "../domain/models/client-model";
import LawyerModel from "../domain/models/lawyer-model";
import CaseModel from "../domain/models/case-model";
import RequestModel from '../domain/models/request-model'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";

export default class RequestController {
  public async create(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const { case_id, lawyer_id } = request.body as { lawyer_id: string; case_id: string }
      const client = await ClientModel.findOne({ token: token })
      const lawyer = await LawyerModel.findById(lawyer_id)
      const linkedCase = await CaseModel.findById(case_id)
      const requestExists = await RequestModel.findOne({ case_id: case_id, lawyer_id: lawyer_id })

      if (requestExists) {
        return network_error({}, 11000, response, '', COMMON_ERRORS.ALREADY_EXIST)
      }

      if (!client) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      if (!linkedCase) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      if (!lawyer) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      const newRequest = new RequestModel({
        case_id: case_id,
        client_id: client._id,
        lawyer_id: lawyer_id,
        client_name: `${client.last_name}, ${client.first_name}`,
        lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
        case_languages: linkedCase.data!.languages,
        case_location: `${linkedCase.data!.country}, ${linkedCase.data!.city}`,
        case_type: linkedCase.data!.case_type,
        case_description: linkedCase.data!.description,
        sent_date: new Date(),
      })

      await newRequest.save()

      return network_success(newRequest, 200, response, 'Request created successfully')

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async deleteRequest(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const { id } = request.params
      const lawyer = await LawyerModel.findOne({ token: token })

      if (!lawyer) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      const requestToDelete = await RequestModel.findOne({ case_id: id, lawyer_id: lawyer._id })

      if (!requestToDelete) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      await requestToDelete.delete()

      return network_success({}, 200, response, 'Request successfully deleted')

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getClientRequests(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const client = await ClientModel.findOne({ token: token })

      if (!client) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      const allRequests = await RequestModel.find({ client_id: client._id })

      return network_success(allRequests, 200, response, 'Request found successfully')

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getLawyerRequests(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const lawyer = await LawyerModel.findOne({ token: token })

      if (!lawyer) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      const allRequests = await RequestModel.find({ lawyer_id: lawyer._id })

      return network_success(allRequests, 200, response, 'Request found successfully')

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getByUserId(request: Request, response: Response) {
    try {
      const { id, user_type } = request.params

      const requests = async () => {
        if (user_type === 'client') {
          const clientRequests = await RequestModel.find({ client_id: id })

          return clientRequests
        } else if (user_type === 'lawyer') {
          const lawyerRequests = await RequestModel.find({ lawyer_id: id })

          return lawyerRequests
        } else {
          return network_error({}, 400, response, 'There is no user type', COMMON_ERRORS.NO_USER_TYPE)
        }
      }

      if (!Array.isArray(requests)) {
        return requests

      } else if (Array.isArray(requests)) {
        if (requests.length > 0) {
          return network_success(requests, 200, response, 'Requests getted successfully')
        } else {
          return network_success({}, 200, response, 'There are no requests yet')
        }
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }
}