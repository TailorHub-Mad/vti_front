import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { PATHS, RoleType } from "../utils/constants/global"
import { LoadingView } from "../views/common/LoadingView"

const Index = () => {
  const router = useRouter()
  const { isLoggedIn, role } = useContext(ApiAuthContext)

  useEffect(() => {
    if (!isLoggedIn) return
    role === RoleType.USER ? router.push(PATHS.newNote) : router.push(PATHS.notes)
  }, [isLoggedIn])

  return <LoadingView />
}

export default Index
