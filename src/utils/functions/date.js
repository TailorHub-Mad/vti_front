export const destructuringDate = (value) => {
  const date = new Date(value)

  const year = date.getFullYear().toLocaleString()
  const month = (date.getMonth() + 1).toLocaleString()
  const day = date.getDate().toLocaleString()

  return { year, month, day }
}

export const formatDateToInput = ({ year, month, day }) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(+day).padStart(2, "0")}`
}
