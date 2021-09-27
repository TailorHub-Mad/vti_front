import { ServiceConstructor } from "."

const NoteService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getNotes = (limit = 50, offset = 0) =>
    execute(instance.get(`/notes?limit=${limit}&offset=${offset}`))
  const getNote = (id) => execute(instance.get(`/notes/${id}`))
  const createNote = (data) => execute(instance.post(`/notes/create`, data))
  const updateNote = (id, data) => execute(instance.put(`/notes/${id}`, data))
  const deleteNote = (id) => execute(instance.delete(`/notes/${id}`))

  // GROUP & FILTER
  const getgroupNotes = (data) =>
    execute(instance.get(`/notes/group?group=${data}&real=true`))
  const getfilterNotes = (data) => execute(instance.get(`/notes/filter?${data}`))
  const getSearchNotes = (data) => execute(instance.get(`/notes/group?${data}`))

  return {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,

    getgroupNotes,
    getfilterNotes,
    getSearchNotes
  }
}

export default NoteService
