import { Request, Response } from "express";

import CaseModel from '../domain/models/case-model'
import ClientModel from "../domain/models/client-model";
import LawyerModel from "../domain/models/lawyer-model";
import NoteModel from "../domain/models/note-model";
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";
import { error } from "console";

export default class CitationController {
  public async create(request: Request, response: Response) {
    try {
      const {user_id, date, note} = request.body

      const noteFound = await NoteModel.findOne({user_id: user_id})

      if(!noteFound) {
        const newNotes = new NoteModel({
          user_id: user_id,
          notes: [{
              date: date,
              note: note
          }]
        })

        await newNotes.save()

        // if(!notesCreated) return server_error(500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

        return network_success({}, 200, response, 'Notes succesfully created')
      }

      const noteUpdated = await NoteModel.updateOne({user_id: user_id}, {$set: {'notes': [...noteFound?.notes!, {date: date, note: note}]}})

      if(!noteUpdated) return network_error({}, 400, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

      return network_success({}, 200, response, 'Notes succesfully updated')

    } catch (error) {
      return server_error(500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }

  public async getNotes(request: Request, response: Response) {
    try {
      const user_id = request.params.user_id

      if(!user_id) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      const notesFound = await NoteModel.findOne({user_id: user_id})

      if(!notesFound) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      return network_success(notesFound.notes, 200, response, 'Notes getted successfully')

    } catch (error) {
      return server_error(500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }

  public async deleteNote(request: Request, response: Response) {
    try {
      const {user_id, note} = request.body
      
      const notesFound = await NoteModel.findOne({user_id: user_id})

      if(!notesFound) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      const newNotes = notesFound.notes

      console.log('newNote: ', newNotes)
      
      notesFound.notes.map(note_found => {
        if(note_found.note === note) {
          newNotes.splice(newNotes.indexOf(note_found), 1)
          return
        }
      })

      console.log('newNote: ', newNotes)
      
      const notesUpdated = await NoteModel.updateOne({user_id: user_id}, {$set: {'notes': newNotes}})

      if(!notesUpdated) return network_error({}, 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

      return network_success({}, 200, response, 'Note successfully deleted')

    } catch (error) {
      return server_error(500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }

//   public async deleteCitation(request: Request, response: Response) {
//     try {

//     } catch (error) {
      
//     }
//   }

//   public async getCaseCitations(request: Request, response: Response) { 
//     try {
//       const caseId = request.headers.caseId
      
//       const caseCitations = await CitationModel.find({case_id: caseId})

//       if(!caseCitations) {
//         return network_error('', 400, response, 'There are no citations for this case', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
      
//       } else {
//         return network_success(caseCitations, 200, response, 'Citations founded!')
//       }

//     } catch (error) {
//       return server_error(500, response, error)
//     }
//   }

//   public async getMonthCitations(request: Request, response: Response) {
//     try {
//       const year = request.headers.year
//       const month = request.headers.month
//       const userId = request.headers.userId
//       const userType = request.headers.userType
      
//       if(userType !== 'client' && userType !== 'lawyer'){
//         return network_error('', 400, response, 'Invalid user type', ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)
        
//       } else if(userType === 'lawyer') {
//         const monthCitations = await CitationModel.find({lawyer_id: userId, year: year, month: month})
  
//         if(!monthCitations) {
//           return network_success('No citations this month', 200, response, 'There are no citations this month')
          
//         } else {
//           return network_success(monthCitations, 200, response, 'Month citations founded!')
//         }

//       } else if(userType === 'client') {
//         const monthCitations = await CitationModel.find({client_id: userId, year: year, month: month})
  
//         if(!monthCitations) {
//           return network_success('No citations this month', 200, response, 'There are no citations this month')
  
//         } else {
//           return network_success(monthCitations, 200, response, 'Month citations founded!')
//         }
//       }


//     } catch (error) {
//       return server_error(500, response, error)
//     }
//   }

//   public async getDateCitations(request: Request, response: Response) {
//     try {
//       const year = request.headers.year
//       const month = request.headers.month
//       const date = request.headers.date
//       const userId = request.headers.userId
//       const userType = request.headers.userType

//       if(userType !== 'client' && userType !== 'lawyer'){
//         return network_error('', 400, response, 'Invalid user type', ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

//       }else if(userType === 'lawyer') {
//         const dateCitations = await CitationModel.find({lawyer_id: userId, year: year, month: month, date: date})

//         if(!dateCitations) {
//           return network_success('No citations this month', 200, response, 'There are no citations this month')
          
//         } else {
//           return network_success(dateCitations, 200, response, 'Month citations founded!')
//         }

//       }else if(userType === 'client') {
//         const dateCitations = await CitationModel.find({client_id: userId, year: year, month: month, date: date})

//         if(!dateCitations) {
//           return network_success('No citations this month', 200, response, 'There are no citations this month')
          
//         } else {
//           return network_success(dateCitations, 200, response, 'Month citations founded!')
//         }
//       }

//     } catch (error) {
//       return server_error(500, response, error)
//     }
//   }
}