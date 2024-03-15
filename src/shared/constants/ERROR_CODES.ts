const ERROR_CODES = {
  REQUEST_ERRORS: {
    NOT_FOUND: {
      code: 'ERR-R001',
      description: "The element couldn't be found",
    },
    BAD_REQUEST: {
      code: 'ERR-R002',
      description: 'Invalid parameters',
    },
    NO_TOKEN_PROVIDED: {
      code: 'ERR-R003',
      description: 'Credentials must be provided',
    },
  },

  SERVER_ERRORS: {
    INTERNAL_ERROR: {
      code: 'ERR-S001',
      description: 'Something is wrong, try again later',
    },
  },
}

const COMMON_ERRORS = {
  NO_TOKEN: {
    code: 'ERR-C001',
    description: 'Credentials must be provided',
  },
  NO_EMAIL: {
    code: 'ERR-C002',
    description: 'Email must be provided',
  },
  NO_USER_TYPE: {
    code: 'ERR-C003',
    description: 'User type must be provided',
  },
  ALREADY_EXIST: {
    code: 'ERR-C004',
    description: 'This already exists',
  },
}

const USER_ERRORS = {
  PASSWORD_ERROR: {
    code: 'ERR-U001',
    description: 'User or password invalid',
  },
}

export { ERROR_CODES, COMMON_ERRORS, USER_ERRORS }