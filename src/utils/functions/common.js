export const getAcronym = (fullName) => {
  return fullName
    ? fullName
        .split(" ")
        .slice(0, 2)
        .map((name) => name.slice(0, 1))
        .join("")
        .toUpperCase()
    : fullName
}

export const capitalize = (word) => {
  return word[0].toUpperCase() + word.slice(1)
}

export const getPercentage = (full, size) => ((size / full) * 100).toFixed(2)

export const getFieldObjectById = (collection, field, id) => {
  const item = collection.find((item) => item.id === id)
  return item[field]
}

export const checkDataIsEmpty = (data) => {
  if (!data) return false
  if (data.length === 0) return true
}
