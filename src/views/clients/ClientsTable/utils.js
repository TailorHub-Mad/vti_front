import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatClient = (data) => data && data?.map(transformClientData)

export const transformClientData = (client) => ({
  selector: "",
  id: {
    label: client.ref,
    value: client._id,
    link: `${PATHS.clients}/${client._id}`
  },
  alias: client.alias,
  name: client.name,
  testSystems: client.testSystems?.map((testSystem) => testSystem.alias),
  projects: client.projects?.map((project) => project.alias),
  options: ""
})

export const groupTable = (data) => {
  return data.map((it) => {
    const _it = [...it]
    _it[1] = it[1].map(transformClientData)
    return _it
  })
}

export const TABLE_CLIENT_HEAD = {
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
  name: {
    label: "Nombre",
    width: calcColWidth(408),
    type: "text"
  },
  testSystems: {
    label: "Sistemas de ensayo",
    width: calcColWidth(220),
    type: "tags",
    config: {
      variant: variantGeneralTag.SYSTEM
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
