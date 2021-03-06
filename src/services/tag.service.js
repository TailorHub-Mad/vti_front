import { ServiceConstructor } from "."

const TagService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getNoteTags = () => execute(instance.get("/tag/notes"))
  const getNoteTag = (id) => execute(instance.get(`/tag/notes/${id}`))
  const getProjectTags = () => execute(instance.get("/tag/projects"))
  const createProjectTag = (data) => execute(instance.post(`/tag/projects`, data))
  const createNoteTag = (data) => execute(instance.post(`/tag/notes`, data))
  const updateProjectTag = (id, data) =>
    execute(instance.put(`/tag/projects/${id}`, data))
  const updateNoteTag = (id, data) => execute(instance.put(`/tag/notes/${id}`, data))
  const deleteProjectTag = (id) => execute(instance.delete(`/tag/projects/${id}`))
  const deleteNoteTag = (id) => execute(instance.delete(`/tag/notes/${id}`))

  // GROUP & FILTER
  const getSearchProjectTags = (data) =>
    execute(instance.get(`/tag/projects/filter?name=${data}&ref=${data}`))
  const getSearchNotesTags = (data) =>
    execute(instance.get(`/tag/notes/filter?name=${data}&ref=${data}`))
  const getFilterNotesTags = (data) =>
    execute(instance.get(`/tag/notes/filter?${data}`))
  const getFilterProjectTags = (data) =>
    execute(instance.get(`/tag/projects/filter?${data}`))

  return {
    getNoteTags,
    getNoteTag,
    getProjectTags,
    createProjectTag,
    createNoteTag,
    updateProjectTag,
    updateNoteTag,
    deleteProjectTag,
    deleteNoteTag,

    getSearchProjectTags,
    getSearchNotesTags,
    getFilterNotesTags,
    getFilterProjectTags
  }
}

export default TagService
