import { PATHS } from "../../../utils/constants/global"
import { fetchType } from "../../../utils/constants/swr"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatUser = (data, fetchState) => {
  if (fetchState === fetchType.GROUP) return groupTable(data)
  return data?.map(transformUserData)
}

export const groupTable = (users) => {
  if (!users) return
  return Object.entries(users)?.map(([key, value]) => {
    return {
      key,
      value: value.map(transformUserData)
    }
  })
}

export const transformUserData = (user) => ({
  selector: "",
  id: { label: user.ref, value: user._id, link: `${PATHS.users}/${user.alias}` },
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
    width: calcColWidth(30),
    type: "text",
    config: { sort: true, name: "alias" }
  },
  fullName: {
    label: "Nombre",
    width: calcColWidth(80),
    type: "text",
    config: { sort: true, name: "name" }
  },
  email: {
    label: "Email",
    width: calcColWidth(110),
    type: "text",
    config: { sort: true, name: "email" }
  },
  department: {
    label: "Departamento",
    width: calcColWidth(50),
    type: "tag",
    config: {
      variant: variantGeneralTag.SYSTEM,
      width: "100%",
      noCollapse: true
    }
  },
  focusPoint: {
    label: "Punto focal proyectos",
    width: calcColWidth(107),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(107),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  options: {
    label: "",
    width: calcColWidth(10),
    type: "options"
  }
}
