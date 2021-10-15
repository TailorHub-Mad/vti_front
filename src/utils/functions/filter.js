export const generateFilterQuery = (keyRef, values) => {
  const queryList = Object.entries(values).reduce((acc, [name, value]) => {
    if (!value) return acc
    if (!keyRef[name]) return acc

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v.value !== "") {
          acc.push(`${[keyRef[name]]}=${v.value}`)
        }
      })

      return acc
    }

    if (typeof value === "object") {
      if (value?.value !== "") {
        acc.push(`${[keyRef[name]]}=${value.value}`)
        return acc
      }

      return acc
    }

    acc.push(`${[keyRef[name]]}=${value}`)
    return acc
  }, [])

  // TODO -> review OR / AND
  queryList.push("union=true")

  const filter = queryList.join("&")

  return filter
}
