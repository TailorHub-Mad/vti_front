import { ServiceConstructor } from "."

const HelpService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getNoteHelps = () => execute(instance.get("/criterion/notes"))
  const getProjectHelps = () => execute(instance.get("/criterion/project"))
  const getNoteTags = () => execute(instance.get("/criterion/notes/tags"))
  const getProjectTags = () => execute(instance.get("/criterion/project/tags"))
  const createProjectCriterion = (data) =>
    execute(instance.post(`/criterion/project`, data))
  const createNoteCriterion = (data) =>
    execute(instance.post(`/criterion/notes`, data))
  const updateProjectCriterion = (id, data) =>
    execute(instance.put(`/criterion/project/update/${id}`, data))
  const updateNoteCriterion = (id, data) =>
    execute(instance.put(`/criterion/notes/update/${id}`, data))
  const createProjectGroup = (id, data) =>
    execute(instance.put(`/criterion/project/${id}`, data))
  const createNoteGroup = (id, data) =>
    execute(instance.put(`/criterion/notes/${id}`, data))
  const deleteProjectCriterion = (id) =>
    execute(instance.delete(`/criterion/projects/${id}`))
  const deleteNoteCriterion = (id) =>
    execute(instance.delete(`/criterion/notes/${id}`))

  // GROUP & FILTER
  const getSearchProjectHelps = (data) =>
    execute(instance.get(`/criterion/project/filter?name=${data}&ref=${data}`))
  const getSearchNotesHelps = (data) =>
    execute(instance.get(`/criterion/notes/filter?name=${data}&ref=${data}`))

  return {
    getNoteHelps,
    getProjectHelps,
    createProjectCriterion,
    createNoteCriterion,
    updateProjectCriterion,
    updateNoteCriterion,
    deleteProjectCriterion,
    deleteNoteCriterion,
    createProjectGroup,
    createNoteGroup,
    getSearchProjectHelps,
    getSearchNotesHelps,
    getNoteTags,
    getProjectTags
  }
}

export default HelpService
