import { fetchType } from "../../../utils/constants/swr"
import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatProject = (projects, fetchState) => {
  if (fetchState === fetchType.GROUP) return groupTable(projects)
  return projects?.map(transformProjectData)
}

export const groupTable = (projects) => {
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
  notes: project.notes?.filter((n) => !Array.isArray(n)),
  options: "",
  config: { isFinished: project.close }
})

export const TABLE_PROJECTS_HEAD = {
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
    width: calcColWidth(220),
    type: "text"
  },
  sector: {
    label: "Sector",
    width: calcColWidth(90),
    type: "text"
  },
  focusPoint: {
    label: "Punto Focal",
    width: calcColWidth(90),
    type: "text"
  },
  testSystems: {
    label: "Sistemas de ensayo",
    width: calcColWidth(210),
    type: "tags"
  },
  tags: {
    label: "Tags de proyecto",
    width: calcColWidth(210),
    type: "tags"
  },
  users: {
    label: "Usuarios",
    width: calcColWidth(60),
    type: "count"
  },
  notes: {
    label: "Apuntes",
    width: calcColWidth(55),
    type: "count"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
