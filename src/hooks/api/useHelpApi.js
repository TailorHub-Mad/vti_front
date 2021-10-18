import HelpService from "../../services/help.service"

const useHelpApi = () => {
  const helpService = HelpService()

  // CRUD
  const getNoteHelps = () => helpService.getNoteHelps()
  const getProjectHelps = () => helpService.getProjectHelps()
  const getNoteTags = () => helpService.getNoteTags()
  const getProjectTags = () => helpService.getProjectTags()
  const createProjectCriterion = (data) => helpService.createProjectCriterion(data)
  const createNoteCriterion = (data) => helpService.createNoteCriterion(data)
  const updateProjectCriterion = (_id, data) =>
    helpService.updateProjectCriterion(_id, data)
  const updateNoteCriterion = (_id, data) =>
    helpService.updateNoteCriterion(_id, data)
  const createNoteGroup = (_id, data) => helpService.createNoteGroup(_id, data)
  const createProjectGroup = (_id, data) => helpService.createProjectGroup(_id, data)
  const deleteProjectCriterion = (id) => helpService.deleteProjectCriterion(id)
  const deleteNoteCriterion = (id) => helpService.deleteNoteCriterion(id)

  // GROUP & FILTER
  const getSearchProjectHelps = (_, data) => helpService.getSearchProjectHelps(data)
  const getSearchNotesHelps = (_, data) => helpService.getSearchNotesHelps(data)
  return {
    getNoteHelps,
    getProjectHelps,
    createProjectCriterion,
    createNoteCriterion,
    updateProjectCriterion,
    updateNoteCriterion,
    deleteProjectCriterion,
    deleteNoteCriterion,
    createNoteGroup,
    createProjectGroup,
    getSearchProjectHelps,
    getSearchNotesHelps,
    getNoteTags,
    getProjectTags
  }
}

export default useHelpApi
