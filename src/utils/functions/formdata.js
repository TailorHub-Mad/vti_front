export const createFormData = (data) => {
  const formData = new FormData()
  data?.file.forEach((document) => {
    formData.append("file", document)
  })

  // Añadimos un array de objetos en el formData
  data?.documents.forEach((url, idx) => {
    Object.entries(url).forEach(([key, value]) => {
      // Metemos en el mismo índice cada propiedad del objeto en el formData
      // para poder crear el objeto en la misma posición del array
      formData.append(`documents[${idx}][${key}]`, value)
    })
  })
  return formData
}
