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

export const parseComplexQuery = (expression, object) => {
  let _expression = expression

  // NOT
  _expression = _expression.replaceAll(":NOT:", "!==")
  // EQUAL
  _expression = _expression.replaceAll(":", "===")
  // AND
  _expression = _expression.replaceAll("&", "&&")

  object

  if (object === COMPLEX_OBJECT.NOTES) {
    _expression = _expression.replaceAll("AliasCL", "notes.clientAlias")
    _expression = _expression.replaceAll("AliasProy", "notes.projects.alias")
    _expression = _expression.replaceAll("RefProy", "notes.projects.ref")
    _expression = _expression.replaceAll("RefSis", "notes.testSystems.ref")
    _expression = _expression.replaceAll("AliasSis", "notes.testSystems.alias")
    _expression = _expression.replaceAll("Cerrado", "notes.isClosed")
    _expression = _expression.replaceAll("Foramlizado", "notes.formalized")
    _expression = _expression.replaceAll("Respuestas", "notes.isAnswered")
    _expression = _expression.replaceAll("TagAp", "notes.tags._id")
    _expression = _expression.replaceAll("TagProy", "notes.projects.tags._id")
    _expression = _expression.replaceAll("RefAp", "notes.ref")
    _expression = _expression.replaceAll("TitleAp", "notes.title")
    _expression = _expression.replaceAll("Description", "notes.description")
    _expression = _expression.replaceAll("Documents", "notes.isDocuments")
    _expression = _expression.replaceAll("VtiCode", "notes.testSystems.vtiCode")
  } else if (object === COMPLEX_OBJECT.PROJECTS) {
    _expression = _expression.replaceAll("TagAp", "projects.notes.tags.name")
    _expression = _expression.replaceAll("TagProy", "projects.tags.name")
    _expression = _expression.replaceAll("AliasProy", "projects.alias")
    _expression = _expression.replaceAll("AliasSis", "projects.testSystems.alias")
    _expression = _expression.replaceAll(
      "AliasFocusPoint",
      "projects.focusPoint.alias"
    )
    _expression = _expression.replaceAll("RefProy", "projects.ref")
    _expression = _expression.replaceAll("RefSis", "projects.testSystems.ref")
    _expression = _expression.replaceAll("VtiCode", "projects.testSystems.vtiCode")
    _expression = _expression.replaceAll("RefAp", "projects.notes.ref")
    _expression = _expression.replaceAll("TitleAp", "projects.notes.title")
    _expression = _expression.replaceAll("Sector", "projects.sector.title")
    _expression = _expression.replaceAll("Year", "projects.date.year")
    _expression = _expression.replaceAll("Closed", "projects.isActive")
    _expression = _expression.replaceAll("AliasCl", "projects.clientAlias")
  } else {
    _expression = _expression.replaceAll("TagAp", "testSystems.notes.tags.name")
    _expression = _expression.replaceAll("TagProy", "testSystems.projects.tags.name")
    _expression = _expression.replaceAll("AliasProy", "testSystems.projects.alias")
    _expression = _expression.replaceAll("AliasSis", "testSystems.alias")
    _expression = _expression.replaceAll("TitleAp", "testSystems.title")
    _expression = _expression.replaceAll("RefProy", "testSystems.projects.ref")
    _expression = _expression.replaceAll("RefSis", "testSystems.ref")
    _expression = _expression.replaceAll("RefAp", "testSystems.notes.ref")
    _expression = _expression.replaceAll("Vticode", "testSystems.vtiCode")
    _expression = _expression.replaceAll("AliasCl", "testSystems.clientAlias")
  }

  const query = mqg(_expression)
  const parseQuery = JSON.stringify(query)

  console.log(query)

  return parseQuery
}
