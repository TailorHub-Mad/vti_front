import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatCode = (data) => data && data?.map(transformCodeData)

export const transformCodeData = (code) => ({
  selector: "",
  id: {
    label: code.ref,
    value: code._id,
    link: `${PATHS.codes}/${code._id}`
  },
  name: code.title,
  projects: code.projects,
  options: ""
})

export const TABLE_CODES_HEAD = {
  selector: {
    label: "",
    width: calcColWidth(32),
    type: "selector"
  },
  id: {
    label: "ID",
    width: calcColWidth(80),
    type: "link",
    config: { sort: true, name: "ref" }
  },
  name: {
    label: "Nombre",
    width: calcColWidth(120),
    type: "text",
    config: { sort: true, name: "name" }
  },
  testSystems: {
    label: "Sistemas de ensayo",
    width: calcColWidth(815),
    type: "tags",
    config: {
      variant: variantGeneralTag.SYSTEM
    }
  },
  options: {
    label: "",
    width: calcColWidth(20),
    type: "options"
  }
}