import CodeService from "../../services/code.service"

const useCodeApi = () => {
  const codeService = CodeService()

  // CRUD
  const getCodes = (_, data) => codeService.getCodes(data)
  const getCode = (_, id) => codeService.getCode(id)
  const createCode = (data) => codeService.createCode(data)
  const updateCode = (id, data) => codeService.updateCode(id, data)
  const deleteCode = (id) => codeService.deleteCode(id)

  // GROUP & FILTER
  const getSearchCodes = (_, data) => codeService.getSearchCodes(data)

  return {
    getCodes,
    getCode,
    createCode,
    updateCode,
    deleteCode,

    getSearchCodes
  }
}

export default useCodeApi
