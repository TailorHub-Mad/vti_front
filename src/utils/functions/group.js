import { groupBy } from "lodash"

export const groupById = (collection) => {
  return groupBy(collection, (c) => c._id)
}
