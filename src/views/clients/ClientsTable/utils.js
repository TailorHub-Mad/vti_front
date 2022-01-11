import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatClient = (data) => data && data?.map(transformClientData)

export const transformClientData = (client) => ({
  selector: "",
  id: {
    label: client.ref,
    value: client._id,
    link: `${PATHS.clients}/${client.alias}`
  },
  alias: client.alias,
  name: client.name,
  testSystems: client.testSystems?.map((testSystem) => testSystem.alias),
  projects: client.projects?.map((project) => project.alias),
  options: ""
})

export const groupTable = (data) => {
  if (!data) return
  return data.map((it) => {
    const _it = [...it]
    _it[1] = it[1].map(transformClientData)
    return _it
  })
}

export const TABLE_CLIENT_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(10),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(60),
    type: "link",
    config: {
      close: true,
      sort: true,
      name: "ref"
    }
  },
  alias: {
    label: "Alias",
    width: calcColWidth(80),
    type: "text",
    config: {
      close: true,
      sort: true,
      name: "alias"
    }
  },
  name: {
    label: "Nombre",
    width: calcColWidth(208),
    type: "text",
    config: {
      close: true,
      sort: true,
      name: "name"
    }
  },
  testSystems: {
    label: "Sistemas de ensayo",
    width: calcColWidth(120),
    type: "tags",
    config: {
      variant: variantGeneralTag.SYSTEM
    }
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(120),
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
