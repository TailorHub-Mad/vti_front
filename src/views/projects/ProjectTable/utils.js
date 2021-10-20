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

export const TABLE_PROJECTS_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(20),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(60),
    type: "link",
    config: { sort: true, name: "ref" }
  },
  alias: {
    label: "Alias",
    width: calcColWidth(120),
    type: "text",
    config: { sort: true, name: "alias" }
  },
  sector: {
    label: "Sector",
    width: calcColWidth(80),
    type: "text",
    config: { sort: true, name: "sector" }
  },
  focusPoint: {
    label: "Punto Focal",
    width: calcColWidth(90),
    type: "text",
    config: { sort: true, name: "focusPoint" }
  },
  testSystems: {
    label: "Sistemas de ensayo",
    width: calcColWidth(80),
    type: "tags",
    config: {
      variant: variantGeneralTag.SYSTEM
    }
  },
  tags: {
    label: "Tags de proyecto",
    width: calcColWidth(287),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  users: {
    label: "Usuarios",
    width: calcColWidth(35),
    type: "count"
  },
  notes: {
    label: "Apuntes",
    width: calcColWidth(20),
    type: "count"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options",
    config: {
      close: true
    }
  }
}
