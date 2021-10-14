import { useRouter } from "next/router"
import { useEffect } from "react"
import { PATHS } from "../../utils/constants/global"

const tagsIndex = () => {
  const router = useRouter()

  useEffect(() => {
    router.push(PATHS.projectTags)
  }, [])

  return null
}

export default tagsIndex
