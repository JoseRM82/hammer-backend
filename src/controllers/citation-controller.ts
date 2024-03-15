import { Request, Response } from "express";

import CaseModel from '../domain/models/case-model'
import ClientModel from "../domain/models/client-model";
import LawyerModel from "../domain/models/lawyer-model";
import CitationModel from "../domain/models/citation-model";
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";

export default class CitationController {
  public async create(request: Request, response: Response) {
    try {
      const {caseId, description, year, month, date, hour, minutes} = request.body
      const uniqueCase = await CaseModel.findOne({_id: caseId})

      if (!uniqueCase) {
        return network_error({}, 400, response, 'Case does not exist', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      } else {
        
        const newCitation = new CitationModel({
          lawyer_id: uniqueCase.lawyer_id,
          client_id: uniqueCase.client_id,
          case_id: uniqueCase._id,
          year: year,
          month: month,
          date: date,
          hour: hour,
          minutes: minutes,
          description: description,
        })

        await newCitation.save()

        return network_success(newCitation, 200, response, 'Citation created succesfully')
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getCitation(request: Request, response: Response) {
    try {

    } catch (error) {

    }
  }

  public async updateCitation(request: Request, response: Response) {
    try {
      const citationID = request.headers.citationID
      
      
    } catch (error) {
      
    }
  }

  public async deleteCitation(request: Request, response: Response) {
    try {

    } catch (error) {
      
    }
  }

  public async getCaseCitations(request: Request, response: Response) { 
    try {
      const caseId = request.headers.caseId
      
      const caseCitations = await CitationModel.find({case_id: caseId})

      if(!caseCitations) {
        return network_error('', 400, response, 'There are no citations for this case', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      
      } else {
        return network_success(caseCitations, 200, response, 'Citations founded!')
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getMonthCitations(request: Request, response: Response) {
    try {
      const year = request.headers.year
      const month = request.headers.month
      const userId = request.headers.userId
      const userType = request.headers.userType
      
      if(userType !== 'client' && userType !== 'lawyer'){
        return network_error('', 400, response, 'Invalid user type', ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)
        
      } else if(userType === 'lawyer') {
        const monthCitations = await CitationModel.find({lawyer_id: userId, year: year, month: month})
  
        if(!monthCitations) {
          return network_success('No citations this month', 200, response, 'There are no citations this month')
          
        } else {
          return network_success(monthCitations, 200, response, 'Month citations founded!')
        }

      } else if(userType === 'client') {
        const monthCitations = await CitationModel.find({client_id: userId, year: year, month: month})
  
        if(!monthCitations) {
          return network_success('No citations this month', 200, response, 'There are no citations this month')
  
        } else {
          return network_success(monthCitations, 200, response, 'Month citations founded!')
        }
      }


    } catch (error) {
      return server_error(500, response, error)
    }
  }

  public async getDateCitations(request: Request, response: Response) {
    try {
      const year = request.headers.year
      const month = request.headers.month
      const date = request.headers.date
      const userId = request.headers.userId
      const userType = request.headers.userType

      if(userType !== 'client' && userType !== 'lawyer'){
        return network_error('', 400, response, 'Invalid user type', ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      }else if(userType === 'lawyer') {
        const dateCitations = await CitationModel.find({lawyer_id: userId, year: year, month: month, date: date})

        if(!dateCitations) {
          return network_success('No citations this month', 200, response, 'There are no citations this month')
          
        } else {
          return network_success(dateCitations, 200, response, 'Month citations founded!')
        }

      }else if(userType === 'client') {
        const dateCitations = await CitationModel.find({client_id: userId, year: year, month: month, date: date})

        if(!dateCitations) {
          return network_success('No citations this month', 200, response, 'There are no citations this month')
          
        } else {
          return network_success(dateCitations, 200, response, 'Month citations founded!')
        }
      }

    } catch (error) {
      return server_error(500, response, error)
    }
  }
}