import { PATHS } from "../../../utils/constants/global"
import { fetchType } from "../../../utils/constants/swr"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatUser = (data, fetchState) => {
  if (fetchState === fetchType.GROUP) return groupTable(data)
  return data?.map(transformUserData)
}

export const groupTable = (systems) => {
  return Object.entries(systems).map(([key, value]) => {
    return {
      key,
      value: value.map(transformUserData)
    }
  })
}

export const transformUserData = (user) => ({
  selector: "",
  id: { label: user.ref, value: user._id, link: `${PATHS.users}/${user._id}` },
  alias: user.alias,
  fullName: user.name,
  email: user.email,
  department: user.department ? [user.department?.name] : undefined,
  focusPoint: user.focusPoint[0]?._id
    ? user.focusPoint.map((p) => p.alias)
    : user.focusPoint,
  projects: user.projectsComments[0]?._id
    ? user.projectsComments.map((p) => p.alias)
    : user.projectsComments,
  options: ""
})

export const TABLE_USERS_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(32),
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
    width: calcColWidth(100),
    type: "text",
    config: { sort: true, name: "alias" }
  },
  fullName: {
    label: "Nombre",
    width: calcColWidth(160),
    type: "text",
    config: { sort: true, name: "name" }
  },
  email: {
    label: "Email",
    width: calcColWidth(158),
    type: "text",
    config: { sort: true, name: "email" }
  },
  department: {
    label: "Departamento",
    width: calcColWidth(80),
    type: "tags",
    config: {
      variant: variantGeneralTag.SYSTEM
    }
  },
  focusPoint: {
    label: "Punto focal proyectos",
    width: calcColWidth(220),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(220),
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
