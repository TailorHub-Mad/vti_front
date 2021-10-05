import NoteService from "../../services/note.service"

const useNoteApi = () => {
  const noteService = NoteService()

  // CRUD
  const getNotes = () => noteService.getNotes()
  const getNote = (_, id) => noteService.getNote(id)
  const createNote = (data) => noteService.createNote(data)
  const updateNote = (id, data) => noteService.updateNote(id, data)
  const deleteNote = (id) => noteService.deleteNote(id)
  const createMessage = (id, data) => noteService.createMessage(id, data)
  const updateMessage = (id, messageId, data) =>
    noteService.updateMessage(id, messageId, data)
  const deleteMessage = (id, messageId) => noteService.deleteMessage(id, messageId)
  const downloadDocument = (id) => noteService.downloadDocument(id)
  const downloadMessageDocument = (id) => noteService.downloadMessageDocument(id)

  // GROUP & FILTER
  const getGroupNotes = (_, data) => noteService.getGroupNotes(data)
  const getFilterNotes = (_, data) => noteService.getFilterNotes(data)
  const getSearchNotes = (_, data) => noteService.getSearchNotes(data)

  const getFavsNotes = (_, data) => noteService.getFavsNotes(data)
  const getSubscribeNotes = (_, data) => noteService.getSubscribeNotes(data)
  const getUnreadNotes = (_, data) => noteService.getUnreadNotes(data)
  const getActiveNotes = (_, data) => noteService.getActiveNotes(data)

  return {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    createMessage,
    updateMessage,
    deleteMessage,
    downloadDocument,
    downloadMessageDocument,

    getGroupNotes,
    getFilterNotes,
    getSearchNotes,

    getFavsNotes,
    getSubscribeNotes,
    getUnreadNotes,
    getActiveNotes
  }
}

export default useNoteApi
