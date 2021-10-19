import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatSector = (data) => data && data?.map(transformSectorData)

export const transformSectorData = (sector) => ({
  selector: "",
  id: {
    label: sector.ref,
    value: sector._id,
    link: `${PATHS.sectors}/${sector._id}`
  },
  name: sector.title,
  projects: sector.projects,
  options: ""
})

export const groupTable = (data) => {
  if (!data) return
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
    type: "link",
    config: { sort: true, name: "ref" }
  },
  name: {
    label: "Nombre",
    width: calcColWidth(120),
    type: "text",
    config: { sort: true, name: "title" }
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(815),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
