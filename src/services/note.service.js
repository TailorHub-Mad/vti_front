import { ServiceConstructor } from "."

const NoteService = () => {
  const { instance, execute } = ServiceConstructor

  const notes = (limit = 50, offset = 0) =>
    execute(instance.get(`/notes?limit=${limit}&offset=${offset}`))
  const note = (id) => execute(instance.get(`/notes/${id}`))
  const createNote = (data) => execute(instance.post(`/notes/create`, data))
  const updateNote = (data) => execute(instance.put(`/notes/${data.id}`, data))
  const deleteNote = (id) => execute(instance.delete(`/notes/${id}`))

  return { notes, note, createNote, updateNote, deleteNote }
}

export default NoteService
