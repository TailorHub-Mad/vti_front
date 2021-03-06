import { ServiceConstructor } from "."

const NoteService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getNotes = (limit = 0, offset = 0) =>
    // execute(instance.get(`/notes?limit=${limit}&offset=${offset}&title=asc`))
    execute(instance.get(`/notes?limit=${limit}&offset=${offset}`))
  const getNote = (id) => execute(instance.get(`/notes/${id}`))
  const createNote = (data) => {
    return execute(
      instance.post(`/notes/create`, data, {
        headers: { "content-type": "multipart/form-data" }
      })
    )
  }
  const updateNote = (id, data) => execute(instance.put(`/notes/${id}`, data))
  const deleteNote = (id) => execute(instance.delete(`/notes/${id}`))
  const createMessage = (id, data) =>
    execute(instance.post(`/notes/${id}/message/create`, data))
  const updateMessage = (id, messageId, data) =>
    execute(instance.put(`/notes/${id}/message/${messageId}`, data))
  const deleteMessage = (id, messageId) =>
    execute(instance.delete(`/notes/${id}/message/${messageId}`))
  const downloadDocument = (id) => execute(instance.get(`/notes/download/${id}`))
  const downloadMessageDocument = (id) =>
    execute(instance.get(`/notes/message/download/${id}`))

  // GROUP & FILTER
  const getGroupNotes = (data) =>
    execute(instance.get(`/notes/group?group=${data}&real=true`))
  const getFilterNotes = (data) => execute(instance.get(`/notes/filter?${data}`))
  const getSearchNotes = (data) => execute(instance.get(`/notes/filter?${data}`))

  const getFavsNotes = () => execute(instance.get(`/notes/filter?favorites=true`))
  const getSubscribeNotes = () =>
    execute(instance.get(`/notes/filter?subscribed=true`))
  const getUnreadNotes = () => execute(instance.get(`/notes/filter?noRead=true`))
  const getActiveNotes = () => execute(instance.get(`/user/active?_id=asc`))

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

export default NoteService
