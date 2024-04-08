import { Request, Response } from "express";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import { v4 as uuidv4 } from 'uuid';

import CaseModel from '../domain/models/case-model'
import ClientModel from "../domain/models/client-model";
import LawyerModel from "../domain/models/lawyer-model";
import RequestModel from '../domain/models/request-model'
import { network_error, network_success, server_error } from '../middlewares/network-middleware'
import { COMMON_ERRORS, ERROR_CODES } from "../shared/constants/ERROR_CODES";
import { Status } from '../domain/repository/case-repository'
import { error } from "console";

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
          next_court: [{
            citation: '',
            date: '',
          }],
          data: caseData,
          needed_files: {
            files_types: [],
            files_url: [{
              name: '',
              url: '',
              key: '',
            }],
          },
          judgement_location: {
            court_adress: ''
          },
          status: Status.on_hold,
          start_date: new Date(),
          end_date: '',
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
      const { request_id, token } = request.body
      const foundRequest = await RequestModel.findById(request_id)

      if (!foundRequest) {
        return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
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

  public async updateNeededFiles(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const userType = request.headers.usertype

      if(userType !== 'client' && userType !== 'lawyer') {
        return network_error('There is no user type', 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)
      }
      
      if(userType === 'lawyer') {
        const needed_file = request.body.neededFile
        const case_id = request.body.caseId
        const lawyer = await LawyerModel.findOne({token: token})
        const caseToUpdate = await CaseModel.findOne({_id: case_id})
        
        if(!caseToUpdate || !lawyer) {
          return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        } 
          
        const filesUpdated = await CaseModel.updateOne({_id: case_id}, {$set: {"needed_files.files_types": [...caseToUpdate.needed_files!.files_types, needed_file]}})
        
        if (!filesUpdated) {
          return network_error('There was a problem saving the file request', 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
        }  

        return network_success('', 200, response, 'Needed files succesfully updated') 
      }

      if(userType === 'client') {
        const case_id = request.body.case_id
        const needed_file = request.body.file_name
        const file_url = request.body.file_url
        const key = request.body.key

        const client = await ClientModel.findOne({token: token})
        const caseToUpdate = await CaseModel.findOne({_id: case_id})
        
        if(!caseToUpdate || !client) {
          return network_error('The case or client does not exist', 400, response, error, ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const currentNeededFiles = caseToUpdate.needed_files!.files_types
        currentNeededFiles.splice(currentNeededFiles.indexOf(needed_file), 1)
        const filesUpdated = await CaseModel.updateOne({_id: case_id}, {$set: {"needed_files.files_types": currentNeededFiles}})
        
        if (!filesUpdated) {
          return network_error('There was an error deleting the needed file from requests', 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
        }

        const currentUrl = caseToUpdate.needed_files!.files_url
        const urlToAdd = {name: needed_file, url: file_url, key: key}

        const fileAddedToUrl = await CaseModel.updateOne({_id: case_id}, {$set: {"needed_files.files_url": currentUrl[0].name === '' ? [urlToAdd] : [...currentUrl, urlToAdd]}})

        if (!fileAddedToUrl) return network_error("The was a problem saving the file", 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

        return network_success(urlToAdd, 200, response, 'Needed files succesfully updated')
      }

    } catch (error) {
      return network_error('Connection to server failed', 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }

  public async getNeededFiles(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const user_type = request.headers.usertype
      const case_id = request.params.case_id

      if(user_type !== 'client' && user_type !== 'lawyer') return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      if(user_type === 'lawyer') {
        const lawyer = await LawyerModel.findOne({token: token})
        
        if(!lawyer) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.NO_TOKEN_PROVIDED) 

      } else if(user_type === 'client') {
        const client = await ClientModel.findOne({token: token})

        if(!client) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.NO_TOKEN_PROVIDED)

      }

      const current_case = await CaseModel.findOne({_id: case_id})
 
      if(!current_case) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      const requested_files = current_case.needed_files!.files_types
      const uploaded_files = current_case.needed_files!.files_url

      const needed_files = {
        requested_files: requested_files,
        uploaded_files: uploaded_files,
      }

      return network_success(needed_files, 200, response, 'Files found')

    } catch(error) {
      return network_error({}, 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }

  public async deleteNeededFile(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const user_type = request.headers.usertype 
      const {needed_file, case_id} = request.body

      if(user_type !== 'client' && user_type !== 'lawyer') {
        return network_error({}, 400, response, 'Wrong user type', ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)
      }

      if(user_type === 'lawyer') {
        const lawyer = await LawyerModel.findOne({token: token})
        const caseToUpdate = await CaseModel.findOne({_id: case_id})
        
        if(!caseToUpdate || !lawyer) return network_error("The case desn't exist", 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

        const currentNeededFiles = caseToUpdate.needed_files!.files_types
        currentNeededFiles.splice(currentNeededFiles.indexOf(needed_file), 1)
        const filesUpdated = await CaseModel.updateOne({_id: case_id}, {$set: {"needed_files.files_types": currentNeededFiles}})
        
        if (!filesUpdated) return network_error('', 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

        return network_success({}, 200, response, 'Needed files succesfully updated') 
      }

      if(user_type === 'client') {
        const client = await ClientModel.findOne({token: token})
        const caseToUpdate = await CaseModel.findOne({_id: case_id})
        
        if(!caseToUpdate || !client) {
          return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
        }

        const currentNeededFiles = caseToUpdate.needed_files!.files_url
        currentNeededFiles.forEach(x => 
          {if(x.name === needed_file) {
            currentNeededFiles.splice(currentNeededFiles.indexOf(x), 1)
          }})

        const filesUpdated = await CaseModel.updateOne({_id: case_id}, {$set: {"needed_files.files_url": currentNeededFiles}})
        
        if (!filesUpdated) {
          return network_error(needed_file, 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
        }

        const fileAddedToRequests = await CaseModel.updateOne({_id: case_id}, {$set: {"needed_files.files_types": [...currentNeededFiles, needed_file]}})

        if (!fileAddedToRequests) return network_error({}, 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

        return network_success('', 200, response, 'Needed files succesfully updated')
      }
      
    } catch(error) {
      return network_error('Connection to server failed', 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }
  
  public async uploadFile(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const user_type = request.headers.usertype
      const ext = request.headers.ext

      if(user_type !== 'client' && user_type !== 'lawyer') return network_error({}, 500, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      if(user_type === 'lawyer') {

      }

      if(user_type === 'client') {
        const clientUser = await ClientModel.findOne({token: token})

        if(!clientUser) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

        const s3client = new S3Client({
          credentials: {
            accessKeyId: process.env.ACC_KEY!,
            secretAccessKey: process.env.SEC_KEY!,
          },
          region: process.env.LOCATION!,
        })

        const file_data = (request.files!.file as UploadedFile).data
        const file_s3_name = uuidv4()
        const file_path = `${file_s3_name}.${ext}`

        const command = new PutObjectCommand({
          'ACL': 'public-read',
          'Body': file_data,
          'Bucket': process.env.BUCKET,
          'Key': file_path,
        })

        const fileSentToS3 = await s3client.send(command)

        if(!fileSentToS3) return network_error({}, 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

        const res = {
          file_url: `${process.env.BASE_URL}${file_path}`,
          ext: `.${ext}`,
          file_key: file_path,
        }

        return network_success(res, 200, response, 'Needed files succesfully updated')
      }
    } catch(error) {
      return network_error({}, 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }
  
  public async deleteFileFromS3(request: Request, response: Response) {
    try {
      const token = request.headers.authorization
      const user_type = request.headers.usertype

      if(user_type !== 'client') return network_error({}, 500, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)
      
      if(user_type === 'client') {
        const clientUser = await ClientModel.findOne({token: token})

        if(!clientUser) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

        const case_id = request.body.case_id
        const file_name = request.body.file_name

        const caseToModify = await CaseModel.findOne({_id: case_id})

        if(!caseToModify) return network_error({}, 400, response, error, ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

        let key = ''
        
        const getKey = (fileName: string) => {
          caseToModify.needed_files!.files_url.forEach(x => { 
            if(x.name === fileName) {
              key += x.key
            }})
            return key
        }

        const s3client = new S3Client({
          credentials: {
            accessKeyId: process.env.ACC_KEY!,
            secretAccessKey: process.env.SEC_KEY!,
          },
          region: process.env.LOCATION!,
        })

        const input = {
          'Bucket': process.env.BUCKET,
          'Key': getKey(file_name),
        }

        const command = new DeleteObjectCommand(input)

        const fileSentToS3 = await s3client.send(command)

        if(!fileSentToS3) return network_error({}, 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)

        return network_success(file_name, 200, response, 'Needed files succesfully updated')
      }
    } catch(error) {
      return network_error('There was a service error', 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
    }
  }

  public async downloadFile(request: Request, response: Response) {
    try {
      const key = request.headers.key as string
      const user_type = request.headers.usertype
      const token = request.headers.authorization
      const case_id = request.headers.caseid

      if(user_type !== 'lawyer') return network_error('Wrong user type', 400, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      const lawyer = await LawyerModel.findOne({token: token})

      if(!lawyer) return network_error('Lawyer does not exist', 400, response, error, ERROR_CODES.REQUEST_ERRORS.NO_TOKEN_PROVIDED)

      const wantedCase = await CaseModel.findOne({_id: case_id})

      if(!wantedCase) return network_error('Case not found', 400, response, error, ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)

      const s3client = new S3Client({
        credentials: {
          accessKeyId: process.env.ACC_KEY!,
          secretAccessKey: process.env.SEC_KEY!,
        },
        region: process.env.LOCATION!,
      })

      const input = {
        "Bucket": process.env.BUCKET as string,
        "Key": key,
      }

      const command = new GetObjectCommand(input)

      const downloadedFile = await s3client.send(command)

      if(!downloadedFile) return network_error('The file was not found', 500, response, error, ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST)

      return network_success('', 200, response, 'File successfully obtained')

    } catch(error) {
      return network_error('There was a service error', 500, response, error, ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR)
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