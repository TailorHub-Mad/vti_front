export const getGroupOptionLabel = (obj, option) => {
  const item = Object.values(obj).find(({ value }) => option === value)
  if (item) return item["label"]
}
