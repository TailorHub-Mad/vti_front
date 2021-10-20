import { fetchType } from "../../../utils/constants/swr"
import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatProject = (projects, fetchState) => {
  if (fetchState === fetchType.GROUP) return groupTable(projects)
  return projects?.map(transformProjectData)
}

export const groupTable = (projects) => {
  if (!projects) return
  return Object.entries(projects).map(([key, value]) => {
    return {
      key,
      value: value.map(transformProjectData)
    }
  })
}

export const transformProjectData = (project) => ({
  selector: "",
  id: {
    label: project.ref,
    value: project._id,
    link: `${PATHS.projects}/${project._id}`
  },
  alias: project.alias,
  sector: project?.sector[0]?.title || "---",
  focusPoint: project.focusPoint?.map((fp) => fp.alias).join(", ") || "---",
  testSystems: project.testSystems?.map((ts) => ts.alias) || "---",
  tags: project.tags?.map((t) => t.name),
  users: project.users?.filter((u) => !Array.isArray(u)),
  notes: project.notes?.filter((n) => n?._id),
  options: "",
  config: { isFinished: Boolean(project.closed) }
})

//Para el cálculo  del ancho: Todas las columnas deben sumar MIN_TABLE_WIDTH - [(nº columnas - 1) * 32]

export const TABLE_PROJECTS_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(10),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(40),
    type: "link",
    config: { sort: true, name: "ref" }
  },
  alias: {
    label: "Alias",
    width: calcColWidth(80),
    type: "text",
    config: { sort: true, name: "alias" }
  },
  sector: {
    label: "Sector",
    width: calcColWidth(40),
    type: "text",
    config: { sort: true, name: "sector" }
  },
  focusPoint: {
    label: "Punto Focal",
    width: calcColWidth(50),
    type: "text",
    config: { sort: true, name: "focusPoint" }
  },
  testSystems: {
    label: "Sistemas de ensayo",
    width: calcColWidth(115),
    type: "tags",
    config: {
      variant: variantGeneralTag.SYSTEM
    }
  },
  tags: {
    label: "Tags de proyecto",
    width: calcColWidth(115),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  users: {
    label: "Usuarios",
    width: calcColWidth(26),
    type: "count"
  },
  notes: {
    label: "Apuntes",
    width: calcColWidth(26),
    type: "count"
  },
  options: {
    label: "",
    width: calcColWidth(10),
    type: "options",
    config: {
      close: true
    }
  }
}
