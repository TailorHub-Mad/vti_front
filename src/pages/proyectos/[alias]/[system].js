import { useRouter } from "next/router"
import React, { useContext } from "react"
import { Page } from "../../../components/layout/Pages/Page"
import { PageBody } from "../../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import useSystemApi from "../../../hooks/api/useSystemApi"
import useFetchSWR from "../../../hooks/useFetchSWR"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { PATHS } from "../../../utils/constants/global"
import { SWR_CACHE_KEYS } from "../../../utils/constants/swr"
import { errorHandler } from "../../../utils/errors"
import { checkDataIsEmpty } from "../../../utils/functions/global"
import { LoadingView } from "../../../views/common/LoadingView"
import { ViewNotFoundState } from "../../../views/common/ViewNotFoundState"
import { NotesGrid } from "../../../views/notes/NotesGrid/NotesGrid"

const apuntesDeSistemas = () => {
  // Hooks
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { getSystem } = useSystemApi()

  // Fetch
  const testSystemId = router.query.system

  const { data, error, isLoading } = useFetchSWR(
    [SWR_CACHE_KEYS.subscription, testSystemId],
    getSystem
  )

  const handleSystemsData = (isEmptyData) => {
    if (!data || isEmptyData) return []
    return data[0].testSystems[0]
  }

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = handleSystemsData(isEmptyData)

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <PageHeader>
        <BreadCrumbs
          customURL={`${PATHS.projects}/${router.query.alias}/Apuntes de ${notesData?.alias}`}
        />
        {!isEmptyData ? <ToolBar noAdd noImport noFilter noGroup noSearch /> : null}
      </PageHeader>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {notesData?.notes?.length === 0 ? (
          <ViewNotFoundState
            text="No hay apuntes"
            onClick={() => router.push(`${PATHS.projects}/${router.query.alias}`)}
          />
        ) : (
          <NotesGrid
            notes={notesData?.notes}
            onSeeDetails={(note) =>
              router.push(
                `${PATHS.projects}/${note.projects[0]?._id}?note=${note._id}`
              )
            }
            checkIsSubscribe={() => {}}
            checkIsFavorite={() => {}}
            onDelete={() => {}}
            handleFavorite={() => {}}
            handleSubscribe={() => {}}
            notesFromSubscription
          />
        )}
      </PageBody>
    </Page>
  )
}

export default apuntesDeSistemas
