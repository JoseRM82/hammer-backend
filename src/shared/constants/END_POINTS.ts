const API_ENDPOINT = 'api'

const lawyer = 'lawyers'
const client = 'clients'
const cases = `${API_ENDPOINT}/cases`
const requests = `${API_ENDPOINT}/requests`
const chats = `${API_ENDPOINT}/chats`
const messages = `${API_ENDPOINT}/messages`
const notes = `${API_ENDPOINT}/notes`

const USERS_ENDPOINTS = {
  LAWYER: {
    CREATE_TOKEN: `/${API_ENDPOINT}/${lawyer}/create-token`,
    CREATE_USER: `/${API_ENDPOINT}/${lawyer}/create-user`,
    VALIDATE_EMAIL: `/${API_ENDPOINT}/${lawyer}/validate-email`,
    GET_ALL: `/${API_ENDPOINT}/${lawyer}/`,
    GET_DATA: `/${API_ENDPOINT}/${lawyer}/:token`,
    UPDATE_LAWYER: `/${API_ENDPOINT}/${lawyer}/update`,
  },

  CLIENT: {
    CREATE_TOKEN: `/${API_ENDPOINT}/${client}/create-token`,
    CREATE_USER: `/${API_ENDPOINT}/${client}/create-user`,
    VALIDATE_EMAIL: `/${API_ENDPOINT}/${client}/validate-email`,
    GET_ALL: `/${API_ENDPOINT}/${client}/`,
    GET_DATA: `/${API_ENDPOINT}/${client}/:token`,
    UPDATE_CLIENT: `/${API_ENDPOINT}/${client}/update`,
  }
}

const CASE = {
  CREATE: `/${cases}/`,
  SET_LAWYER: `/${cases}/set-lawyer`,
  // GET_DATA: `/${cases}/:id`,
  GET_CURRENT_CLIENT_CASES: `/${cases}/client`,
  GET_CURRENT_LAWYER_CASES: `/${cases}/lawyer`,
  GET_NEEDED_FILES: `/${cases}/needed-files/:case_id`,
  UPDATE_NEEDED_FILES: `/${cases}/update-needed-files`,
  DELETE_NEEDED_FILE: `/${cases}/delete-needed-file`,
  DOWNLOAD_FILE: `/${cases}/download-file`,
  UPLOAD_FILE: `/${cases}/upload-file`,
  DELETE_FILE_S3: `/${cases}/delete-file-s3`,
  GET_PAST_CLIENT_CASES: `/${cases}/past/client`,
  GET_PAST_LAWYER_CASES: `/${cases}/past/lawyer`,
  // UPDATE_DESCRIPTION: `/${cases}/:id`,
  // FINISH_CASE: `${cases}/:id`,
}

const REQUEST = {
  CREATE: `/${requests}`,
  DELETE: `/${requests}/delete`,
  GET_CLIENT_REQUESTS: `/${requests}/client`,
  GET_LAWYER_REQUESTS: `/${requests}/lawyer`,
  // GET_BY_USER_ID: `/${requests}/:userId`,
}

const AUTH = {
  LOGIN: `/${API_ENDPOINT}/login`,
  GET_OWN_ID: `/${API_ENDPOINT}/ownid`,
}

const CHAT = {
  CREATE_A_CHAT: `/${chats}`,
  GET_CHATS: `/${chats}/get-own-chats`,
  GET_MESSAGES_FROM_A_CHAT: `/${chats}/get-a-chat`,
}

const MESSAGE = {
  CREATE: `/${messages}`,
  GET_MESSAGES: `/${messages}`,
  SET_READED_MESSAGES: `/${messages}/read`,
}

const NOTE = {
  CREATE: `/${notes}`,
  GET_NOTES: `/${notes}/:user_id`,
  DELETE_NOTE: `/${notes}/delete`,
}

export { USERS_ENDPOINTS, CASE, AUTH, REQUEST, MESSAGE, CHAT, NOTE }