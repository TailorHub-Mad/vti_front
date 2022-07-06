import axios from "axios"
import { getSessioncookie } from "./cookies"

export const downloadFile = (name, id) => {
  const { vti } = getSessioncookie()
  const config = {
    headers: { Authorization: `Bearer ${vti}` }
  }
  return axios({
    url: `http://localhost:3001/api/notes/download/${id}`,
    method: "GET",
    responseType: "blob",
    ...config
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", name)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    })
    .catch((e) => {
      console.error(e)
    })
}
