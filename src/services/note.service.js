import { ServiceConstructor } from "."

const NoteService = () => {
  const { instance, execute } = ServiceConstructor

  const notes = (limit = 50, offset = 0) =>
    execute(instance.get(`/notes?limit=${limit}&offset=${offset}`))
  const note = (id) => execute(instance.get(`/notes/${id}`))
  const createNote = (data) => execute(instance.post(`/notes/create`, data))
  const updateNote = (id, data) => execute(instance.put(`/notes/${id}`, data))
  const deleteNote = (id) => execute(instance.delete(`/notes/${id}`))
  const createMessage = (id, data) =>
    execute(instance.post(`/notes/${id}/message/create`, data))
  const updateMessage = (id, messageId, data) =>
    execute(instance.put(`/notes/${id}/message/${messageId}`, data))

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

export default NoteService
