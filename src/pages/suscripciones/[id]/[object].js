import React, { useContext, useState } from "react"
import { Page } from "../../../components/layout/Pages/Page"
import { PageBody } from "../../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../../../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../../utils/constants/swr"
import { errorHandler } from "../../../utils/errors"
import { checkDataIsEmpty } from "../../../utils/functions/global"
import { LoadingView } from "../../../views/common/LoadingView"
import { ViewNotFoundState } from "../../../views/common/ViewNotFoundState"
import { NotesGrid } from "../../../views/notes/NotesGrid/NotesGrid"
import { NotesGroup } from "../../../views/notes/NotesGroup/NotesGroup"
import { getGroupOptionLabel } from "../../../utils/functions/objects"
import { useRouter } from "next/router"
import { projectFetchHandler } from "../../../swr/project.swr"
import { PATHS } from "../../../utils/constants/global"
import { systemFetchHandler } from "../../../swr/systems.swr"

const NOTES_GROUP_OPTIONS = [
  {
    label: "Proyecto",
    value: "alias"
  },
  {
    label: "Año",
    value: "year"
  },
  {
    label: "Sector",
    value: "sector"
  },
  {
    label: "Tags de apunte",
    value: "notes.tags.name"
  }
]

const apuntesSuscripciones = () => {
  // Hooks
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const {
    query: { type: typeObject }
  } = router

  // States

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  const fetcher =
    typeObject === "projects" ? projectFetchHandler : systemFetchHandler

  const { data, error, isLoading } = fetcher(fetchType.ID, {
    [fetchOption.ID]: router.query.object
  })

  const handleNotesData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState == fetchType.GROUP) return data
    const { projects, testSystems } = data[0]
    const { notes } = typeObject === "projects" ? projects[0] : testSystems[0]
    return notes.map((n) => {
      return {
        ...n
      }
    })
  }

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = handleNotesData(isEmptyData)

  const isGrouped = fetchState == fetchType.GROUP

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  // Filters
  const onSearch = (search) => {
    if (!search) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.SEARCH]: null
      })
      return
    }

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: search
    })
  }

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <PageHeader>
        <BreadCrumbs
          customURL={`${PATHS.subscriptions}/${router.query.owner}`}
          lastElement={`/${
            typeObject === "projects" ? "Proyectos" : "Sistemas ensayo"
          }/apuntes`}
        />
        {isToolbarHidden() && (
          <ToolBar
            onSearch={onSearch}
            searchPlaceholder="Busqueda por ID, Proyecto"
            fetchState={fetchState}
            noImport
            noAdd
            noFilter
            noGroup
          />
        )}
      </PageHeader>
      <PageMenu></PageMenu>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? (
          <LoadingView mt="-200px" />
        ) : isEmptyData ? (
          <ViewNotFoundState noBack text="No hay apuntes asociados" />
        ) : (
          <>
            {fetchState === fetchType.GROUP ? (
              <NotesGroup
                notes={notesData}
                onSeeDetails={(note) =>
                  router.push(
                    typeObject === "projects"
                      ? `${PATHS.projects}/${router.query.object}?note=${note._id}`
                      : `${PATHS.notes}?note=${note._id}`
                  )
                }
                checkIsSubscribe={() => {}}
                checkIsFavorite={() => {}}
                onDelete={() => {}}
                handleFavorite={() => {}}
                handleSubscribe={() => {}}
                notesFromSubscription
                groupOption={getGroupOptionLabel(
                  NOTES_GROUP_OPTIONS,
                  fetchOptions[fetchOption.GROUP]
                )}
                isGrouped={isGrouped}
                fetchState={fetchState}
              />
            ) : (
              <NotesGrid
                notes={notesData}
                onSeeDetails={(note) =>
                  router.push(
                    typeObject === "projects"
                      ? `${PATHS.projects}/${router.query.object}?note=${note._id}`
                      : `${PATHS.notes}?note=${note._id}`
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
          </>
        )}
      </PageBody>
    </Page>
  )
}

export default apuntesSuscripciones
