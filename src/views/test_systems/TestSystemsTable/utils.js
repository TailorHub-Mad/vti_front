import { PATHS } from "../../../utils/constants/paths"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatSystem = (data) => {
  // data && !isGrouped ? data?.map(transformSystemData) : groupTable(data)
  return data && data?.map(transformSystemData)
}

export const transformSystemData = (system) => ({
  selector: "",
  id: { label: system.ref, value: system._id },
  alias: { label: system.alias, link: `${PATHS.testSystems}/${system._id}` },
  client: system.clientAlias,
  code: system.vtiCode,
  year: system.date?.year,
  projects: system.projects,
  notes: system.notes,
  options: ""
})

export const groupTable = (data) => {
  return data.map((it) => {
    const _it = [...it]
    _it[1] = it[1].map(transformSystemData)
    return _it
  })
}

export const TABLE_SYSTEMS_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(32),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(88),
    type: "mapText"
  },
  alias: {
    label: "Alias",
    width: calcColWidth(88),
    type: "link"
  },
  client: {
    label: "Cliente",
    width: calcColWidth(80),
    type: "text"
  },
  code: {
    label: "Código",
    width: calcColWidth(75),
    type: "text"
  },
  year: {
    label: "Año",
    width: calcColWidth(45),
    type: "text"
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(260),
    type: "tags"
  },
  notes: {
    label: "Apuntes",
    width: calcColWidth(350),
    type: "tags"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
