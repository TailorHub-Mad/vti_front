import { PATHS } from "../../../utils/constants/paths"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatProject = (projects) => {
  // projects && !isGrouped ? projects?.map(transformProjectData) : groupTable(projects)
  return projects && projects?.map(transformProjectData)
}

export const transformProjectData = (project) => ({
  selector: "",
  id: { label: project.ref, value: project._id },
  alias: { label: project.alias, link: `${PATHS.projects}/${project._id}` },
  sector: project?.sector[0]?.title || "---",
  focusPoint: project.focusPoint?.map((fp) => fp.alias).join(", ") || "---",
  testSystems: project.testSystems?.map((ts) => ts.alias) || "---",
  tags: project.tag?.map((ts) => ts.name),
  users: project.tag?.map((ts) => ts.alias),
  notes: project.notes?.map((note) => note.title),
  options: "",
  config: { isFinished: project.close }
})

export const groupTable = (projects) => {
  return projects.map((it) => {
    const _it = [...it]
    _it[1] = it[1].map(transformProjectData)
    return _it
  })
}

export const TABLE_PROJECTS_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(32),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(90),
    type: "mapText"
  },
  alias: {
    label: "Alias",
    width: calcColWidth(100),
    type: "link"
  },
  sector: {
    label: "Sector",
    width: calcColWidth(120),
    type: "text"
  },
  focusPoint: {
    label: "Punto Focal",
    width: calcColWidth(120),
    type: "text"
  },
  testSystems: {
    label: "Sistemas de ensayo",
    width: calcColWidth(220),
    type: "tags"
  },
  tags: {
    label: "Tags de proyecto",
    width: calcColWidth(220),
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