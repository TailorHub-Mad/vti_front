import TagService from "../../services/tag.service"

const useTagApi = () => {
  const tagService = TagService()

  // CRUD
  const getNoteTags = () => tagService.getNoteTags()
  const getNoteTag = (id) => tagService.getNoteTag(id)
  const getProjectTags = () => tagService.getProjectTags()
  const createProjectTag = (data) => tagService.createProjectTag(data)
  const createNoteTag = (data) => tagService.createNoteTag(data)
  const updateProjectTag = (_id, data) => tagService.updateProjectTag(_id, data)
  const updateNoteTag = (_id, data) => tagService.updateNoteTag(_id, data)
  const deleteProjectTag = (id) => tagService.deleteProjectTag(id)
  const deleteNoteTag = (id) => tagService.deleteNoteTag(id)

  // GROUP & FILTER
  const getSearchProjectTags = (_, data) => tagService.getSearchProjectTags(data)
  const getSearchNotesTags = (_, data) => tagService.getSearchNotesTags(data)
  const getFilterNotesTags = (_, data) => tagService.getFilterNotesTags(data)
  const getFilterProjectTags = (_, data) => tagService.getFilterProjectTags(data)

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

export default useTagApi
