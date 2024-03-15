import { Response } from "express";
import { ERROR_CODES } from '../shared/constants/ERROR_CODES'

const network_success = (data: any, status_code: number = 200, response: Response, message?: string) => {
  if (!Array.isArray(data)) {
    response.status(status_code)
  } else {
    const code = data.length === 0 ? 200 : status_code
    response.status(code)
  }

  response.send({
    data,
    message: message ?? 'Request made successfully',
    success: true,
  })
}

const network_error = (data: any, status_code: number = 400, response: Response, error: any, error_code = ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR) => {
  response.status(status_code)

  if (error.code === 11000) {
    response.send({
      error: {
        ...error,
        info: ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST
      },
      message: 'Item already exists',
      success: false,
    })
    return
  }

  response.send({
    data,
    error: {
      ...error,
      info: error_code
    },
    message: error.message ?? error_code.description,
    success: false,
  })
}

const server_error = (status_code: number = 500, response: Response, error: any, error_code = ERROR_CODES.SERVER_ERRORS.INTERNAL_ERROR) => {
  console.error({ error })
  response.status(status_code)

  if (error.code) {
    if (error.code === 11000) {
      response.send({
        error: {
          ...error,
          info: ERROR_CODES.REQUEST_ERRORS.BAD_REQUEST,
        },
        message: 'Item already exists',
        success: false,
      })
      return
    }
  }

  response.send({
    error: {
      ...error,
      info: error_code,
    },
    message: error_code.description,
    success: false,
  })
}

export { network_success, network_error, server_error }