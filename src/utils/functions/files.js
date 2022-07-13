import axios from "axios"
import { getSessioncookie } from "./cookies"

export const downloadFile = (name, id, isMessage) => {
  const downloadRoute = isMessage
    ? `/notes/message/download/${id}`
    : `/notes/download/${id}`
  const { vti } = getSessioncookie()
  const config = {
    headers: { Authorization: `Bearer ${vti}` }
  }
  return axios({
    url: `${process.env.NEXT_PUBLIC_API_URL}${downloadRoute}`,
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
