import TagService from "../../services/tag.service"

const useTagApi = () => {
  const tagService = TagService()

  const getNoteTags = () => tagService.getNoteTags()
  const getProjectTags = () => tagService.getProjectTags()
  const createProjectTag = (data) => tagService.createProjectTag(data)
  const createNoteTag = (data) => tagService.createNoteTag(data)
  const updateProjectTag = (id_data) => tagService.updateProjectTag(id_data)
  const updateNoteTag = (id_data) => tagService.updateNoteTag(id_data)
  const deleteProjectTag = (id) => tagService.deleteProjectTag(id)
  const deleteNoteta = (id) => tagService.deleteNoteta(id)

  return {
    getNoteTags,
    getProjectTags,
    createProjectTag,
    createNoteTag,
    updateProjectTag,
    updateNoteTag,
    deleteProjectTag,
    deleteNoteta
  }
}

export default useTagApi
