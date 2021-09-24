import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatClient = (data) => {
  // data && !isGrouped ? data?.map(transformClientData) : groupTable(data)
  return data && data?.map(transformClientData)
}

export const transformClientData = (client) => ({
  selector: "",
  id: { label: client.ref, value: client._id },
  alias: client.alias,
  name: { label: client.name, link: `${PATHS.clients}/${client._id}` },
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
    width: calcColWidth(80),
    type: "mapText"
  },
  alias: {
    label: "Alias",
    width: calcColWidth(80),
    type: "text"
  },
  name: {
    label: "Nombre",
    width: calcColWidth(300),
    type: "link"
  },
  testSystems: {
    label: "Sistemas de ensayo",
    width: calcColWidth(250),
    type: "tags"
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(300),
    type: "tags"
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}
