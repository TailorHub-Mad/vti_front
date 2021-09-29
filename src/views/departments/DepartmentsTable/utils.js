import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"

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
  return data.map((it) => {
    const _it = [...it]
    _it[1] = it[1].map(transformDepartmentData)
    return _it
  })
}

export const TABLE_DEPARTMENT_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(32),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(80),
    type: "link"
  },
  name: {
    label: "Departamento",
    width: calcColWidth(120),
    type: "text"
  },
  users: {
    label: "Usuarios",
    width: calcColWidth(815),
    type: "tags"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
