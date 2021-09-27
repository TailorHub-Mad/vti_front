import NoteService from "../../services/note.service"

const useNoteApi = () => {
  const noteService = NoteService()

  const notes = () => noteService.notes()
  const note = (id) => noteService.note(id)
  const createNote = (data) => noteService.createNote(data)
  const updateNote = (id, data) => noteService.updateNote(id, data)
  const deleteNote = (id) => noteService.deleteNote(id)
  const createMessage = (id, data) => noteService.createMessage(id, data)
  const updateMessage = (id, messageId, data) =>
    noteService.updateMessage(id, messageId, data)

  return {
    notes,
    note,
    createNote,
    updateNote,
    deleteNote,
    createMessage,
    updateMessage
  }
}

export default useNoteApi
