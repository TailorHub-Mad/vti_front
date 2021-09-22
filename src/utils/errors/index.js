import { ErrorView } from "../../views/common/ErrorView"

// TODO -> provisional
export const errorHandler = (error) => {
  console.error(error)
  return <ErrorView />
}
