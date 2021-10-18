export const groupTable = (notes) => {
  return Object.entries(notes).map(([key, value]) => {
    return {
      key,
      value: value
    }
  })
}
