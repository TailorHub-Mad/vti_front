import { PATHS } from "../../../utils/constants/paths"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatSector = (data) => {
  // data && !isGrouped ? data?.map(transformSectorData) : groupTable(data)
  return data && data?.map(transformSectorData)
}

export const transformSectorData = (sector) => ({
  selector: "",
  id: { label: sector.ref, value: sector._id },
  name: { label: sector.title, link: `${PATHS.sectors}/${sector._id}` },
  projects: sector.projects,
  options: ""
})

export const groupTable = (data) => {
  return data.map((it) => {
    const _it = [...it]
    _it[1] = it[1].map(transformSectorData)
    return _it
  })
}

export const TABLE_SECTORS_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(32),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(80),
    type: "mapText"
  },
  name: {
    label: "Nombre",
    width: calcColWidth(120),
    type: "link"
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(815),
    type: "tags"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
