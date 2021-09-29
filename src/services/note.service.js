import { ServiceConstructor } from "."

const NoteService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getNotes = (limit = 0, offset = 0) =>
    execute(instance.get(`/notes?limit=${limit}&offset=${offset}`))
  const getNote = (id) => execute(instance.get(`/notes/${id}`))
  const createNote = (data) => execute(instance.post(`/notes/create`, data))
  const updateNote = (id, data) => execute(instance.put(`/notes/${id}`, data))
  const deleteNote = (id) => execute(instance.delete(`/notes/${id}`))
  const createMessage = (id, data) =>
    execute(instance.post(`/notes/${id}/message/create`, data))
  const updateMessage = (id, messageId, data) =>
    execute(instance.put(`/notes/${id}/message/${messageId}`, data))

  // GROUP & FILTER
  const getGroupNotes = (data) =>
    execute(instance.get(`/notes/group?group=${data}&real=true`))
  const getFilterNotes = (data) => execute(instance.get(`/notes/filter?${data}`))
  const getSearchNotes = (data) => execute(instance.get(`/notes/group?${data}`))

  const getFavsNotes = (data) => execute(instance.get(`/notes/group?${data}`)) // TODO -> pending
  const getSubscribeNotes = (data) => execute(instance.get(`/notes/group?${data}`)) // TODO -> pending
  const getUnreadNotes = (data) => execute(instance.get(`/notes/group?${data}`)) // TODO -> pending
  const getActiveNotes = (data) => execute(instance.get(`/notes/group?${data}`)) // TODO -> pending

  return {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    createMessage,
    updateMessage,

    getGroupNotes,
    getFilterNotes,
    getSearchNotes,

    getFavsNotes,
    getSubscribeNotes,
    getUnreadNotes,
    getActiveNotes
  }
}

export default NoteService
