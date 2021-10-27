import axios from "axios"
import { getSessioncookie } from "../utils/functions/cookies"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

axiosInstance.interceptors.request.use(async (config) => {
  const { vti: token } = getSessioncookie()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const ServiceConstructor = {
  instance: axiosInstance,
  execute: async (request) => {
    try {
      const { data } = await request
      return data
    } catch (error) {
      if (error?.response?.config?.method !== "post") throw error
      return {
        error: {
          status: error.response.status,
          message: error.message
        }
      }
    }
  }
}
