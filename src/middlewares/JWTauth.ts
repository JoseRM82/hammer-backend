import { Request } from "express";

import { ERROR_CODES } from "../shared/constants/ERROR_CODES";
import validateJWT from "./validateJWT";

const JWTauth = (request: Request) => {
  try {
    if (request.headers.authorization) {
      const hasBearer = request.headers.authorization.includes('Bearer ')

      if (hasBearer) {
        const token = request.headers.authorization.replace('Bearer ', '')
        const data = validateJWT(token)
        return data!
      }
      throw ERROR_CODES.REQUEST_ERRORS.NO_TOKEN_PROVIDED
    }
    throw ERROR_CODES.REQUEST_ERRORS.NO_TOKEN_PROVIDED
  } catch (err) {
    throw err
  }
}

export default JWTauth