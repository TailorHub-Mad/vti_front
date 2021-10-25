import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatDepartment = (data) => data && data?.map(transformDepartmentData)

export const transformDepartmentData = (department) => ({
  selector: "",
  id: {
    label: department.ref,
    value: department._id,
    link: `${PATHS.departments}/${department._id}`
  },
  name: department.name,
  users: department.users.map((u) => u.alias),
  options: ""
})

export const groupTable = (data) => {
  if (!data) return
  return data.map((it) => {
    const _it = [...it]
    _it[1] = it[1].map(transformDepartmentData)
    return _it
  })
}

export const TABLE_DEPARTMENT_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(10),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(50),
    type: "link",
    config: { sort: true, name: "ref" }
  },
  name: {
    label: "Departamento",
    width: calcColWidth(60),
    type: "text",
    config: { sort: true, name: "name" }
  },
  users: {
    label: "Usuarios",
    width: calcColWidth(542),
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
