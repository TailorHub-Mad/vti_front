export const downloadFile = (file, name) => {
  const url = window.URL.createObjectURL(new Blob([file]))
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", name)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
