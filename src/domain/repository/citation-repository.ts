export default interface CitationRepository {
  _id?: string,
  lawyer_id: string,
  client_id: string,
  case_id: string,
  year: number,
  month: number,
  date: number,
  hour: number,
  minutes: number,
  description: string,
}