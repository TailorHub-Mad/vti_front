import { PATHS } from "../../../utils/constants/paths"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatUser = (data) => {
  // data && !isGrouped ? data?.map(transformUserData) : groupTable(data)
  return data && data?.map(transformUserData)
}

export const transformUserData = (user) => ({
  selector: "",
  id: { label: user.ref, value: user._id },
  alias: user.alias,
  fullName: { label: user.name, link: `${PATHS.users}/${user._id}` },
  email: user.email,
  department: user.department?.name,
  focusPoint: user.focusPoint,
  projects: user.projects,
  options: ""
})

export const groupTable = (data) => {
  return data.map((it) => {
    const _it = [...it]
    _it[1] = it[1].map(transformUserData)
    return _it
  })
}

export const TABLE_USERS_HEAD = {
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
  alias: {
    label: "Alias",
    width: calcColWidth(80),
    type: "text"
  },
  fullName: {
    label: "Nombre",
    width: calcColWidth(120),
    type: "link"
  },
  email: {
    label: "Email",
    width: calcColWidth(150),
    type: "text"
  },
  department: {
    label: "Departamento",
    width: calcColWidth(80),
    type: "tags"
  },
  focusPoint: {
    label: "Punto focal proyectos",
    width: calcColWidth(200),
    type: "tags"
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(250),
    type: "tags"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
