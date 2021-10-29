const mqg = require("mongo-query-generator")

export const generateFilterQuery = (keyRef, values, noUnion) => {
  const queryList = Object.entries(values).reduce((acc, [name, value]) => {
    if (!value) return acc
    if (!keyRef[name]) return acc

    if (name === "dateFrom") {
      const { dateFrom, dateTo } = values
      if (dateFrom && dateTo) {
        acc.push(`${[keyRef["date"]]}=${dateFrom};${dateTo}`)
      } else if (dateFrom) {
        acc.push(`${[keyRef["date"]]}=${dateFrom};${new Date()}`)
      } else if (dateTo) {
        acc.push(`${[keyRef["date"]]}=${new Date()};${dateTo}`)
      }

      return acc
    }
    if (name === "dateTo") return acc

    if (name === "opened") {
      acc.push(`${[keyRef[name]]}=false`)
      return acc
    }

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

  if (!noUnion) queryList.push("union=true")

  const filter = queryList.join("&")

  return filter
}

export const COMPLEX_OBJECT = {
  NOTES: "notes",
  TEST_SYSTEMS: "testSystmems",
  PROJECTS: "projects"
}

export const parseComplexQuery = (expression) => {
  let _expression = expression

  // NOT
  _expression = _expression.replaceAll(":NOT:", "!==")
  // EQUAL
  _expression = _expression.replaceAll(":", "===")
  // AND
  _expression = _expression.replaceAll("&", "&&")

  // TagAp
  _expression = _expression.replaceAll("TagAp", "notes.tags.name")
  // TagProy
  _expression = _expression.replaceAll("TagProy", "notes.projects.tags.name")
  // Proy
  _expression = _expression.replaceAll("Proy", "note.projects.alias")
  // Sis
  _expression = _expression.replaceAll("Sis", "note.testSystems.alias")

  return mqg(_expression)
}
