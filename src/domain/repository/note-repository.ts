export default interface NoteRepository {
  _id?: string,
  user_id: string,
  notes: Notes[],
}

interface Notes {
  date: string,
  note: string,
}