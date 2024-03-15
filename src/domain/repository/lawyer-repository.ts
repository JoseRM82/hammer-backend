export default interface LawyerRepository {
  _id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  user_type?: string;
  password?: string;
  data?: Data;
  token?: string,
}

interface Data {
  identification?: string;
  university?: string;
  specialty_branch?: string;
  graduated_at?: string;
  birthdate?: string;
  country?: string;
  city?: string;
  adress?: string;
  work_area?: string;
  zip_code?: string;
  languages?: string;
  phone_number?: string;
  photo?: string;
  description?: string;
}