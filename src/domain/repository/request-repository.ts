export default interface RequestRepository {
  case_id: string;
  lawyer_id: string;
  client_id: string;
  lawyer_name: string;
  client_name: string;
  case_languages: string;
  case_location: string;
  case_type: string;
  case_description: string;
  sent_date: Date;
}