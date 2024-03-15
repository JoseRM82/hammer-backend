import { Request, Response } from "express";

import CaseModel from '../domain/models/case-model'
import ClientModel from "../domain/models/client-model";
import LawyerModel from "../domain/models/lawyer-model";
import RequestModel from '../domain/models/request-model'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";
import { Status } from '../domain/repository/case-repository'

export default class CaseController {
  public async create(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const { caseData } = request.body
      const client = await ClientModel.findOne({ token: token })

      if (!client) {
        return network_error({}, 400, response, 'Client does not exist', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

      } else {
        const newCase = new CaseModel({
          client_id: client._id,
          client_name: `${client.last_name}, ${client.first_name}`,
          data: caseData,
          status: Status.on_hold,
          start_date: new Date(),
        })

        await newCase.save()

        return network_success(newCase, 200, response, 'Case created successfully')
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async setLawyer(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const { request_id } = request.body
      const foundRequest = await RequestModel.findById(request_id)

      if (!foundRequest) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      const lawyer = await LawyerModel.findOne({ token: token })

      if (!lawyer) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      }

      const caseId = foundRequest.case_id

      await RequestModel.deleteMany({ case_id: caseId })

      const foundCase = await CaseModel.findOneAndUpdate(
        { _id: caseId },
        {
          lawyer_id: lawyer._id,
          lawyer_name: `${lawyer.last_name}, ${lawyer.first_name}`,
          status: Status.in_progress
        },
        { new: true },
      )

      return network_success(foundCase, 200, response, 'Connected to a lawyer successfully')


    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async updateDescription(request: Request, response: Response) {
    // try {
    //   const { id } = request.params
    //   const { caseDescription } = request.body
    //   const foundCase = await CaseModel.findById(id)

    //   await foundCase!.updateOne({
    //     case_description: caseDescription,
    //   })

    //   return network_success(foundCase?.data?.description, 200, response, 'Description updated successfully')

    // } catch (error) {
    //   return server_error(500, response, error)
    // }
  }

  public async getCase(request: Request, response: Response) {
    // try {
    //   const { id } = request.params
    //   const foundCase = await CaseModel.findById(id)

    //   return network_success(foundCase, 200, response, 'Case found')

    // } catch (error) {
    //   return server_error(500, response, error)
    // }
  }

  public async getCurrentClientCases(request: Request, response: Response) {
    try {
      const token = request.headers.authorization

      try {
        const client = await ClientModel.findOne({ token: token })

        if (!client) {
          return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

        }

        const onHoldClientCases = await CaseModel.find({ client_id: client._id, status: Status.on_hold })
        const inProgressClientCases = await CaseModel.find({ client_id: client._id, status: Status.in_progress })

        const clientCases = [...onHoldClientCases, ...inProgressClientCases]

        return network_success(clientCases, 200, response, 'Cases got successfully')

      } catch (error) {
        return network_error({}, 400, response, error, COMMON_ERRORS.NO_USER_TYPE)
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getCurrentLawyerCases(request: Request, response: Response) {
    try {
      const token = request.headers.authorization

      try {
        const lawyer = await LawyerModel.findOne({ token: token })

        if (!lawyer) {
          return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const lawyerCases = await CaseModel.find({ lawyer_id: lawyer._id, status: Status.in_progress })

        return network_success(lawyerCases, 200, response, 'Cases got successfully')

      } catch (error) {
        return network_error({}, 400, response, error, COMMON_ERRORS.NO_USER_TYPE)
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getPastClientCases(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const client = await ClientModel.findOne({ token: token })

      if (!client) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

      } else {
        const pastCases = await CaseModel.find({ client_id: client._id, status: Status.finished })

        if (pastCases.length <= 0) {
          return network_success([], 200, response, 'There are no past cases yet')
        }

        return network_success(pastCases, 200, response, 'Past cases found successfully')

      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getPastLawyerCases(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const lawyer = await LawyerModel.findOne({ token: token })

      if (!lawyer) {
        return network_error({}, 400, response, '', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

      } else {

        const pastCases = await CaseModel.find({ lawyer_id: lawyer._id, status: Status.finished })

        return network_success(pastCases, 200, response, 'Past cases found successfully')

      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async finishCase(request: Request, response: Response) {
    // try {
    //   const { id } = request.params
    //   const foundCase = await CaseModel.findById(id)

    //   if (!foundCase) {
    //     return network_error({}, 400, response, 'Case not found', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

    //   } else {
    //     await foundCase.updateOne({
    //       status: 'finished',
    //     })

    //     return network_success(foundCase, 200, response, 'Case found successfully')
    //   }

    // } catch (error) {
    //   return server_error(500, response, error)
    // }
  }
}