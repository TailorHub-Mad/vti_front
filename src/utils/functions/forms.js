export const checkFormIsEmpty = (values) => {
  return !Object.keys(values).every((e) => values[e] !== "")
}

export const checkIsYear = (year) => {
  const currentYear = new Date().getFullYear()
  return year > "1900" && year < currentYear
}
