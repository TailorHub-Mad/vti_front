import { ServiceConstructor } from "."

const TagService = () => {
  const { instance, execute } = ServiceConstructor

  const getNoteTags = () => execute(instance.get("/tag/notes"))
  const getProjectTags = () => execute(instance.get("/tag/projects"))

  const createProjectTag = (data) => execute(instance.post(`/tag/notes`, data))
  const createNoteTag = (data) => execute(instance.post(`/tag/projects`, data))

  const updateProjectTag = (id, data) =>
    execute(instance.put(`/tag/notes/${id}`, data))
  const updateNoteTag = (id, data) =>
    execute(instance.put(`/tag/projects/${id}`, data))

  const deleteProjectTag = (id) => execute(instance.delete(`/tag/notes/${id}`))
  const deleteNotetag = (id) => execute(instance.delete(`/tag/projects/${id}`))

  return {
    getNoteTags,
    getProjectTags,
    createProjectTag,
    createNoteTag,
    updateProjectTag,
    updateNoteTag,
    deleteProjectTag,
    deleteNotetag
  }
}

export default TagService
