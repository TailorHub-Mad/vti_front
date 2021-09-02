export const checkFormIsEmpty = (values) => {
  return !Object.keys(values).every((e) => values[e] !== "")
}
