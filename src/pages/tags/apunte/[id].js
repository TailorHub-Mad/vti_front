import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { Page } from "../../../components/layout/Pages/Page"
import { PageBody } from "../../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import useTagApi from "../../../hooks/api/useTagApi"
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
  const { getNoteTag } = useTagApi()

  // Fetch

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `notes.tags._id=${router.query?.id}`
  })
  const [noteTag, setNoteTag] = useState("")

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
        [fetchOption.FILTER]: `notes.tags._id=${router.query?.id}`
      })
      return
    }

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: `notes.ref=${search}&notes.title=${search}&notes.tags._id=${router.query?.id}&union=true`
    })
  }

  useEffect(() => {
    if (!router.query?.id) return

    const _getTag = async () => {
      const _tag = await getNoteTag(router.query.id)
      setNoteTag(_tag.name)
    }

    _getTag()
  }, [router])

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <PageHeader>
        <BreadCrumbs
          customURL={`${PATHS.noteTags}/${noteTag}`}
          lastElement="apuntes"
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
