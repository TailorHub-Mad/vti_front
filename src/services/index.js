import axios from "axios"
import { getSessioncookie } from "../utils/functions/cookies"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

instance.interceptors.request.use(async (config) => {
  const { vti: token } = getSessioncookie()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

class ServiceConstructor {
  constructor(errorHandler, removeError) {
    this.instance = instance
    this.errorHandler = errorHandler
    this.removeError = removeError
  }

  makeRequest = async (request, validate) => {
    try {
      typeof validate === "function" && validate()
      this.removeError()
      const response = await request
      return response.data
    } catch (e) {
      this.errorHandler(
        e.response?.data?.details ? e.response.data.details[0]?.message : e?.message
      )
      if (e.response.config.method === "post") return { error: true }
      throw e
    }
  }
}

export default ServiceConstructor
