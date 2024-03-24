import CaseRepository from './case-repository'

export default interface ClientRepository {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  data: Data;
  token: string;
}

interface Data {
  identification: string;
  birthdate: string;
  country: string;
  zip_code: string;
  languages: string;
  phone_number: string;
}