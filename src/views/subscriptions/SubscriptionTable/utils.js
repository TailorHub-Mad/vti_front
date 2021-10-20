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

//Para el cálculo  del ancho: Todas las columnas deben sumar MIN_TABLE_WIDTH - [(nº columnas - 1) * 32]

export const TABLE_SUBSCRIPTIONS_HEAD = {
  id: {
    label: "Alias",
    width: calcColWidth(68),
    type: "link",
    config: { sort: true, name: "alias" }
  },
  name: {
    label: "Usuario",
    width: calcColWidth(201),
    type: "text",
    config: { sort: true, name: "user" }
  },
  projects: {
    label: "Proyectos",
    width: calcColWidth(201),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  systems: {
    label: "Sistemas",
    width: calcColWidth(201),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  },
  notes: {
    label: "Apuntes",
    width: calcColWidth(201),
    type: "tags",
    config: {
      variant: variantGeneralTag.NOTE
    }
  }
}
