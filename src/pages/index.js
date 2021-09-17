import { useRouter } from "next/dist/client/router"
import { useContext, useEffect } from "react"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { PATHS } from "../utils/constants/paths"

const Index = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  useEffect(() => {
    if (!isLoggedIn) return
    router.push(PATHS.projects)
  }, [isLoggedIn])

  return <>Loading...</>
}

export default Index
