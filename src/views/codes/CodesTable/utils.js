// import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"

export const formatCode = (data) => data && data?.map(transformCodeData)

export const transformCodeData = (code) => ({
  selector: "",
  // id: code.ref,
  id: {
    label: code.ref,
    value: code._id
  },
  name: code.name,
  options: ""
})

export const TABLE_CODES_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(10),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(80),
    type: "text",
    config: { sort: true, name: "ref" }
  },
  name: {
    label: "Nombre",
    width: calcColWidth(600),
    type: "text",
    config: { sort: true, name: "name" }
  },
  options: {
    label: "",
    width: calcColWidth(10),
    type: "options"
  }
}
