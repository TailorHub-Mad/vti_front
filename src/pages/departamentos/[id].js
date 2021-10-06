import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { PATHS } from "../../utils/constants/global"
import { errorHandler } from "../../utils/errors"
import { LoadingView } from "../../views/common/LoadingView"
import { checkDataIsEmpty } from "../../utils/functions/global"
import { UsersByObject } from "../../views/users/UsersByObject/UsersByObject"
import { departmentFetchHandler } from "../../swr/department.swr"

const department = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const departmentId = router.query.id

  const [fetchState, setFetchState] = useState(fetchType.ID)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.ID]: departmentId
  })

  const { data, error, isLoading, isValidating } = departmentFetchHandler(
    fetchState,
    fetchOptions
  )

  const notFound = !isValidating && !data
  const isEmptyData = checkDataIsEmpty(data)
  const usersData = data && !isEmptyData ? data.users : null

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el departamento.</>}
      {data && (
        <UsersByObject
          usersData={usersData}
          customURL={`${PATHS.departments}/${data?.ref}`}
          setFetchState={setFetchState}
          setFetchOptions={setFetchOptions}
          fetchState={fetchState}
          fetchOptions={fetchOptions}
          isEmptyData={isEmptyData}
        />
      )}
    </Page>
  )
}

export default department
