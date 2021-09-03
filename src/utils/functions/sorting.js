export const sortAlphabetic = (arr) => {
  const sortedObj = {}
  arr
    .sort((a, b) => a.localeCompare(b))
    .map((word) => {
      const letter = word.slice(0, 1)
      sortedObj[letter] = sortedObj[letter] ? [...sortedObj[letter], word] : [word]
    })
  return sortedObj
}
