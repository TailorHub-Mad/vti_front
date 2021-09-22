export const destructuringDate = (value) => {
  const date = new Date(value)

  const year = date.getFullYear().toLocaleString()
  const month = date.getMonth().toLocaleString()
  const day = date.getDay().toLocaleString()

  return { year, month, day }
}
