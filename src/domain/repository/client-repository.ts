import CaseRepository from './case-repository'

export default interface ClientRepository {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  password: string;
  data: Data;
  token: string;
}

interface Data {
  identification: string;
  birthdate: string;
  country: string;
  state: string;
  city: string;
  adress: string;
  zip_code: string;
  languages: string;
  phone: string;
}