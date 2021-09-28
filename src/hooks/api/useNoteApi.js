import NoteService from "../../services/note.service"

const useNoteApi = () => {
  const noteService = NoteService()

  // CRUD
  const getNotes = () => noteService.getNotes()
  const getNote = (id) => noteService.getNote(id)
  const createNote = (data) => noteService.createNote(data)
  const updateNote = (id, data) => noteService.updateNote(id, data)
  const deleteNote = (id) => noteService.deleteNote(id)
  const createMessage = (id, data) => noteService.createMessage(id, data)
  const updateMessage = (id, messageId, data) =>
    noteService.updateMessage(id, messageId, data)

  // GROUP & FILTER
  const getgroupNotes = (_, data) => noteService.getgroupNotes(data)
  const getfilterNotes = (_, data) => noteService.getfilterNotes(data)
  const getSearchNotes = (_, data) => noteService.getSearchNotes(data)

  return {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    createMessage,
    updateMessage,

    getgroupNotes,
    getfilterNotes,
    getSearchNotes
  }
}

export default useNoteApi
