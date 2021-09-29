import { PATHS } from "../../../utils/constants/global"
import { fetchType } from "../../../utils/constants/swr"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatSystem = (systems, fetchState) => {
  if (fetchState === fetchType.GROUP) return groupTable(systems)
  return systems?.map(transformSystemData)
}

export const groupTable = (systems) => {
  return Object.entries(systems).map(([key, value]) => {
    return {
      key,
      value: value.map(transformSystemData)
    }
  })
}

export const transformSystemData = (system) => ({
  selector: "",
  id: {
    label: system.ref,
    value: system._id,
    link: `${PATHS.testSystems}/${system._id}`
  },
  alias: system.alias,
  client: system.clientAlias,
  code: system.vtiCode,
  year: system.date?.year,
  projects: system.projects.filter((p) => !Array.isArray(p)).map((p) => p.alias),
  notes: system.notes.filter((n) => !Array.isArray(n)).map((n) => n.title),
  options: ""
})

export const TABLE_SYSTEMS_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(32),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(60),
    type: "link"
  },
  alias: {
    label: "Alias",
    width: calcColWidth(180),
    type: "text"
  },
  client: {
    label: "Cliente",
    width: calcColWidth(120),
    type: "text"
  },
  code: {
    label: "Código",
    width: calcColWidth(158),
    type: "text"
  },
  year: {
    label: "Año",
    width: calcColWidth(45),
    type: "text"
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(220),
    type: "tags"
  },
  notes: {
    label: "Apuntes",
    width: calcColWidth(220),
    type: "tags"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
