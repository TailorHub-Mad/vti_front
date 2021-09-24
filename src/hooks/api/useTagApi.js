import TagService from "../../services/tag.service"

const useTagApi = () => {
  const tagService = TagService()

  const getNoteTags = () => tagService.getNoteTags()
  const getProjectTags = () => tagService.getProjectTags()
  const createProjectTag = (data) => tagService.createProjectTag(data)
  const createNoteTag = (data) => tagService.createNoteTag(data)
  const updateProjectTag = (_id,data) => tagService.updateProjectTag(_id, data)
  const updateNoteTag = (_id,data) => tagService.updateNoteTag(_id, data)
  const deleteProjectTag = (id) => tagService.deleteProjectTag(id)
  const deleteNoteTag = (id) => tagService.deleteNoteTag(id)

  return {
    getNoteTags,
    getProjectTags,
    createProjectTag,
    createNoteTag,
    updateProjectTag,
    updateNoteTag,
    deleteProjectTag,
    deleteNoteTag
  }
}

export default useTagApi
