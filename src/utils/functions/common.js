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
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

export const getPercentage = (full, size) => ((size / full) * 100).toFixed(2)
