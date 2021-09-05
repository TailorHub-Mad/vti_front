import SystemService from "../../services/systems.service"
import useApiError from "../useApiError"

const useSystemApi = () => {
  const { addError, removeError } = useApiError()

  const systemService = new SystemService(addError, removeError)

  const systems = () => systemService.systems()

  return { systems }
}

export default useSystemApi
