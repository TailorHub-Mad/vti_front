import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatSubscription = (data) =>
  data && data?.map(transformSubscriptionData)

export const transformSubscriptionData = (subscription) => ({
  selector: "",
  id: {
    label: subscription.ref,
    value: subscription._id,
    link: `${PATHS.subscriptions}/${subscription._id}`
  },
  name: subscription.title,
  projects: subscription.projects,
  options: ""
})

export const TABLE_SUBSCRIPTIONS_HEAD = {
  id: {
    label: "Alias",
    width: calcColWidth(80),
    type: "link",
    config: { sort: true, name: "alias" }
  },
  name: {
    label: "Usuario",
    width: calcColWidth(120),
    type: "text",
    config: { sort: true, name: "user" }
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(120),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  systems: {
    label: "Proyectos",
    width: calcColWidth(120),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  notes: {
    label: "Proyectos",
    width: calcColWidth(120),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  tagProjects: {
    label: "Proyectos",
    width: calcColWidth(120),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  tagNotes: {
    label: "Tags de apunte",
    width: calcColWidth(120),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  }
}
