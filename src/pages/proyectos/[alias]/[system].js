import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { Page } from "../../../components/layout/Pages/Page"
import { PageBody } from "../../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import useProjectApi from "../../../hooks/api/useProjectApi"
import useSystemApi from "../../../hooks/api/useSystemApi"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { noteFetchHandler } from "../../../swr/note.swr"
import { PATHS } from "../../../utils/constants/global"
import { fetchOption, fetchType } from "../../../utils/constants/swr"
import { errorHandler } from "../../../utils/errors"
import { checkDataIsEmpty } from "../../../utils/functions/global"
import { LoadingView } from "../../../views/common/LoadingView"
import { ViewNotFoundState } from "../../../views/common/ViewNotFoundState"
import { NotesGrid } from "../../../views/notes/NotesGrid/NotesGrid"

const apuntesDeSistemas = () => {
  // Hooks
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { getProject } = useProjectApi()
  const { getSystem } = useSystemApi()

  // Fetch

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `notes.testSystems._id=${router.query?.system}`
  })
  const [project, setProject] = useState("")
  const [system, setSystem] = useState("")

  const handleSystemsData = (isEmptyData) => {
    if (!data || isEmptyData) return []
    return data[0].notes
  }

  const { data, isLoading, error, isValidating } = noteFetchHandler(
    fetchState,
    fetchOptions
  )

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = handleSystemsData(isEmptyData)

  const onSearch = (search) => {
    if (!search) {
      setFetchState(fetchType.FILTER)
      setFetchOptions({
        [fetchOption.FILTER]: `notes.testSystems._id=${router.query?.system}`
      })
      return
    }

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: `notes.ref=${search}&notes.alias=${search}&notes.testSystems._id=${router.query?.system}`
    })
  }

  useEffect(() => {
    if (!router.query?.alias) return

    const _getProject = async () => {
      const _project = await getProject(null, router.query.alias)

      setProject(_project[0].projects[0].alias)
    }

    const _getSystem = async () => {
      const _system = await getSystem(null, router.query.system)

      setSystem(_system[0].testSystems[0].alias)
    }

    _getProject()
    _getSystem()
  }, [router])

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <PageHeader>
        <BreadCrumbs
          customURL={`${PATHS.projects}/${project}/Apuntes de ${system}`}
        />
        <ToolBar
          noAdd
          noImport
          noFilter
          noGroup
          searchPlaceholder="Busqueda por ID, Alias"
          onSearch={onSearch}
        />
      </PageHeader>
      <PageBody>
        {isLoading || isValidating ? (
          <LoadingView mt="-200px" />
        ) : isEmptyData ? (
          <ViewNotFoundState noBack />
        ) : isEmptyData && !isValidating ? (
          <ViewNotFoundState
            text="No hay apuntes"
            onClick={() => router.push(`${PATHS.projects}/${router.query.alias}`)}
          />
        ) : (
          <NotesGrid
            notes={notesData}
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
