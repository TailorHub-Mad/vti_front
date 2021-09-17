import NoteService from "../../services/note.service"

const useNoteApi = () => {
  const noteService = NoteService()

  const notes = () => noteService.notes()
  const note = (id) => noteService.note(id)
  const createNote = (data) => noteService.createNote(data)
  const updateNote = (data) => noteService.updateNote(data)
  const deleteNote = (id) => noteService.deleteNote(id)

  return { notes, note, createNote, updateNote, deleteNote }
}

export default useNoteApi
