import { useRouter } from "next/dist/client/router"
import { useContext, useEffect } from "react"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { PATHS } from "../utils/constants/paths"
import { LoadingView } from "../views/common/LoadingView"

const Index = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  useEffect(() => {
    if (!isLoggedIn) return
    router.push(PATHS.notes)
  }, [isLoggedIn])

  return <LoadingView />
}

export default Index
