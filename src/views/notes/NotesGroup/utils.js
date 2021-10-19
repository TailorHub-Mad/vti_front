export const groupTable = (notes) => {
  if (!notes) return
  return Object.entries(notes).map(([key, value]) => {
    return {
      key,
      value: value
    }
  })
}
