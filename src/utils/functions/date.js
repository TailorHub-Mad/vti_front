export const destructuringDate = (value) => {
  const date = new Date(value)

  const year = date.getFullYear().toLocaleString()
  const month = date.getMonth().toLocaleString()
  const day = date.getDay().toLocaleString()

  return { year, month, day }
}

export const formatDateToInput = ({ year, month, day }) => {
  return `${year}-${String(month).padStart(2, "0")}-${String(+day + 1).padStart(
    2,
    "0"
  )}`
}
