import { ServiceConstructor } from "."

const HelpService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getNoteHelps = () => execute(instance.get("/criterion/notes"))
  const getProjectHelps = () => execute(instance.get("/criterion/project"))
  const createProjectHelp = (data) =>
    execute(instance.post(`/criterion/project`, data))
  const createNoteHelp = (data) => execute(instance.post(`/criterion/notes`, data))
  const updateProjectHelp = (id, data) =>
    execute(instance.put(`/criterion/project/${id}`, data))
  const updateNoteHelp = (id, data) =>
    execute(instance.put(`/criterion/notes/${id}`, data))
  const deleteProjectHelp = (id) =>
    execute(instance.delete(`/criterion/project/${id}`))
  const deleteNoteHelp = (id) => execute(instance.delete(`/criterion/notes/${id}`))

  // GROUP & FILTER
  const getSearchProjectHelps = (data) =>
    execute(instance.get(`/criterion/project/filter?name=${data}&ref=${data}`))
  const getSearchNotesHelps = (data) =>
    execute(instance.get(`/criterion/notes/filter?name=${data}&ref=${data}`))

  return {
    getNoteHelps,
    getProjectHelps,
    createProjectHelp,
    createNoteHelp,
    updateProjectHelp,
    updateNoteHelp,
    deleteProjectHelp,
    deleteNoteHelp,

    getSearchProjectHelps,
    getSearchNotesHelps
  }
}

export default HelpService
