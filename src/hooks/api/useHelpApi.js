import HelpService from "../../services/help.service"

const useHelpApi = () => {
  const helpService = HelpService()

  // CRUD
  const getNoteHelps = () => helpService.getNoteHelps()
  const getProjectHelps = () => helpService.getProjectHelps()
  const createProjectHelp = (data) => helpService.createProjectHelp(data)
  const createNoteHelp = (data) => helpService.createNoteHelp(data)
  const updateProjectHelp = (_id, data) => helpService.updateProjectHelp(_id, data)
  const updateNoteHelp = (_id, data) => helpService.updateNoteHelp(_id, data)
  const deleteProjectHelp = (id) => helpService.deleteProjectHelp(id)
  const deleteNoteHelp = (id) => helpService.deleteNoteHelp(id)

  // GROUP & FILTER
  const getSearchProjectHelps = (_, data) => helpService.getSearchProjectHelps(data)
  const getSearchNotesHelps = (_, data) => helpService.getSearchNotesHelps(data)
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

export default useHelpApi
