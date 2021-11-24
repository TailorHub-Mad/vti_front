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
  try {
    let _expression = expression

    // NOT
    _expression = _expression.replaceAll(":NOT:", "!==")
    // EQUAL
    _expression = _expression.replaceAll(":", "===")
    // AND
    _expression = _expression.replaceAll("&", "&&")

    let query = mqg(_expression)
    let parseQuery = JSON.stringify(query)

    if (object === COMPLEX_OBJECT.NOTES) {
      parseQuery = parseQuery.replaceAll("AliasCL", "notes.clientAlias")
      parseQuery = parseQuery.replaceAll("AliasProy", "notes.projects.alias")
      parseQuery = parseQuery.replaceAll("RefProy", "notes.projects.ref")
      parseQuery = parseQuery.replaceAll("RefSis", "notes.testSystems.ref")
      parseQuery = parseQuery.replaceAll("AliasSis", "notes.testSystems.alias")
      parseQuery = parseQuery.replaceAll("Cerrado", "notes.isClosed")
      parseQuery = parseQuery.replaceAll("Formalizado", "notes.formalized")
      parseQuery = parseQuery.replaceAll("Respuestas", "notes.isAnswered")
      parseQuery = parseQuery.replaceAll("TagAp", "notes.tags.name")
      parseQuery = parseQuery.replaceAll("TagProy", "notes.projects.tags.name")
      parseQuery = parseQuery.replaceAll("RefAp", "notes.ref")
      parseQuery = parseQuery.replaceAll("TitleAp", "notes.title")
      parseQuery = parseQuery.replaceAll("Description", "notes.description")
      parseQuery = parseQuery.replaceAll("Documents", "notes.isDocuments")
      parseQuery = parseQuery.replaceAll("VtiCode", "notes.testSystems.vtiCode")
    } else if (object === COMPLEX_OBJECT.PROJECTS) {
      parseQuery = parseQuery.replaceAll("TagAp", "projects.notes.tags.name")
      parseQuery = parseQuery.replaceAll("TagProy", "projects.tags.name")
      parseQuery = parseQuery.replaceAll("AliasProy", "projects.alias")
      parseQuery = parseQuery.replaceAll("AliasSis", "projects.testSystems.alias")
      parseQuery = parseQuery.replaceAll(
        "AliasFocusPoint",
        "projects.focusPoint.alias"
      )
      parseQuery = parseQuery.replaceAll("RefProy", "projects.ref")
      parseQuery = parseQuery.replaceAll("RefSis", "projects.testSystems.ref")
      parseQuery = parseQuery.replaceAll("VtiCode", "projects.testSystems.vtiCode")
      parseQuery = parseQuery.replaceAll("RefAp", "projects.notes.ref")
      parseQuery = parseQuery.replaceAll("TitleAp", "projects.notes.title")
      parseQuery = parseQuery.replaceAll("Sector", "projects.sector.title")
      parseQuery = parseQuery.replaceAll("Year", "projects.date.year")
      parseQuery = parseQuery.replaceAll("Closed", "projects.isActive")
      parseQuery = parseQuery.replaceAll("AliasCl", "projects.clientAlias")
    } else {
      parseQuery = parseQuery.replaceAll("TagAp", "testSystems.notes.tags.name")
      parseQuery = parseQuery.replaceAll("TagProy", "testSystems.projects.tags.name")
      parseQuery = parseQuery.replaceAll("AliasProy", "testSystems.projects.alias")
      parseQuery = parseQuery.replaceAll("AliasSis", "testSystems.alias")
      parseQuery = parseQuery.replaceAll("TitleAp", "testSystems.title")
      parseQuery = parseQuery.replaceAll("RefProy", "testSystems.projects.ref")
      parseQuery = parseQuery.replaceAll("RefSis", "testSystems.ref")
      parseQuery = parseQuery.replaceAll("RefAp", "testSystems.notes.ref")
      parseQuery = parseQuery.replaceAll("Vticode", "testSystems.vtiCode")
      parseQuery = parseQuery.replaceAll("AliasCl", "testSystems.clientAlias")
    }
    console.log("query parsiada", parseQuery)
    return parseQuery
  } catch (error) {
    console.log("ERROR PARSEO", error)
    return null
  }
}
