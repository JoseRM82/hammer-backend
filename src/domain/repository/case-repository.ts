export default interface CaseRepository {
  _id?: string;
  client_id?: string;
  client_name?: string;
  lawyer_id?: string;
  lawyer_name?: string;
  next_court?: NextCourt[];
  needed_files?: NeededFiles;
  data?: Data;
  judgement_location?: JudgmentLocation;
  status?: Status;
  start_date?: Date;
  end_date?: Date;
}

export interface NextCourt {
  citation: string;
  date: string;
}

export interface NeededFiles {
  files_types: string[]; 
  files_url: Files_URL[];
}

export interface Files_URL {
  name: string;
  url: string;
  key: string;
}

export interface Data {
  phone_number: string;
  email: string;
  city: string;
  state: string;
  country: string;
  adress: string;
  languages: string;
  case_type: string;
  description: string;
}

export interface JudgmentLocation {
  country: string;
  city: string;
  court_adress: string;
}

export enum Status {
  on_hold = 'on_hold',
  in_progress = 'in_progress',
  finished = 'finished',
}