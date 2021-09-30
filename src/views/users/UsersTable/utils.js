import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatUser = (data) => {
  // data && !isGrouped ? data?.map(transformUserData) : groupTable(data)
  return data && data?.map(transformUserData)
}

export const transformUserData = (user) => ({
  selector: "",
  id: { label: user.ref, value: user._id, link: `${PATHS.users}/${user._id}` },
  alias: user.alias,
  fullName: user.name,
  email: user.email,
  department: user.department ? [user.department?.name] : undefined,
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
    width: calcColWidth(60),
    type: "link"
  },
  alias: {
    label: "Alias",
    width: calcColWidth(100),
    type: "text"
  },
  fullName: {
    label: "Nombre",
    width: calcColWidth(160),
    type: "text"
  },
  email: {
    label: "Email",
    width: calcColWidth(158),
    type: "text"
  },
  department: {
    label: "Departamento",
    width: calcColWidth(80),
    type: "tags"
  },
  focusPoint: {
    label: "Punto focal proyectos",
    width: calcColWidth(220),
    type: "tags"
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(220),
    type: "tags"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
