export const sortAlphabetic = (arr) => {
  const sortedObj = {}
  arr
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((word) => {
      const letter = word.slice(0, 1).toUpperCase()
      sortedObj[letter] = sortedObj[letter] ? [...sortedObj[letter], word] : [word]
    })
  return sortedObj
}
