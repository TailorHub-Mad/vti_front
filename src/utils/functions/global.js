export const getAcronym = (name) => {
  console.log("NAME", name)
  if (!name) return ""
  if (name?.length <= 3) {
    return name
  }

  return name
    .split(" ")
    .slice(0, 2)
    .map((_name) => _name.slice(0, 1))
    .join("")
    .toUpperCase()
}

export const capitalize = (word) => {
  return word[0].toUpperCase() + word.slice(1)
}

export const getPercentage = (full, size) => ((size / full) * 100).toFixed(2)

export const getFieldObjectById = (collection, field, id) => {
  if (!Array.isArray(collection)) return
  const item = collection?.find((item) => item._id === id)
  return item ? item[field] : null
}

export const getFieldGRoupObjectById = (collection, field, id, key) => {
  const item = collection[key]?.find((item) => item._id === id)
  return item ? item[field] : null
}

export const checkDataIsEmpty = (data) => {
  if (!data) return true
  if (data?.length === 0) return true
}

export const generateQueryStr = (queryObj) => {
  const filter = Object.entries(queryObj)
    .filter(([, value]) => value)
    .map(([key, value]) => key + "=" + value)
    .join("&")

  return filter
}
