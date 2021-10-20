import { PATHS } from "../../../utils/constants/global"
import { calcColWidth } from "../../../utils/constants/tables"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const formatSubscription = (data) =>
  data && data?.map(transformSubscriptionData)

export const transformSubscriptionData = (subscription) => ({
  id: {
    label: subscription.ref,
    value: subscription._id,
    link: `${PATHS.subscriptions}/${subscription._id}`
  },
  name: subscription.name,
  projects: subscription.subscribed.projects.map((s) => s.alias),
  systems: subscription.subscribed.testSystems.map((s) => s.alias),
  notes: subscription.subscribed.notes.map((s) => s.title)
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
    width: calcColWidth(265),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  systems: {
    label: "Sistemas",
    width: calcColWidth(265),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  notes: {
    label: "Apuntes",
    width: calcColWidth(265),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  }
}
