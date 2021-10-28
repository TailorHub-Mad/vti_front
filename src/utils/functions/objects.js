export const getGroupOptionLabel = (obj, option) => {
  const item = Object.values(obj).find(({ value }) => {
    return option?.includes(value)
  })

  if (item) return item["label"]
  else return ""
}
