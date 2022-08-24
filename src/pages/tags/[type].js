import { Grid, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import React, { useContext, useEffect, useState } from "react"
import { jsonToCSV } from "react-papaparse"
import { TagCard } from "../../components/cards/TagCard/TagCard"
import { AddTagIcon } from "../../components/icons/AddTagIcon"
import { Page } from "../../components/layout/Pages/Page"
import { PageBody } from "../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../../components/overlay/Popup/Popup"
import useTagApi from "../../hooks/api/useTagApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { tagFetchHandler } from "../../swr/tag.swr"
import { PATHS } from "../../utils/constants/global"
import { errorHandler } from "../../utils/errors"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import {
  tagDataTransform,
  transformTagsToExport
} from "../../utils/functions/import_export/tags_helper"
import { LoadingView } from "../../views/common/LoadingView"
import { NewTagModal } from "../../views/tags/NewTag/NewTagModal/NewTagModal"
import { TagsHeader } from "../../views/tags/TagsHeader/TagsHeader"
import download from "downloadjs"
import { generateFilterQuery } from "../../utils/functions/filter"
import { TagsFilterModal } from "../../views/tags/TagsFilter/TagsFilterModal"
import { TAGS_FILTER_KEYS } from "../../utils/constants/filter"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"

const infoByType = {
  proyecto: {
    title: "Tags de proyecto",
    addTitle: "Añadir tag de proyecto",
    editSuccessMsg: "Editado correctamente",
    editTitle: "Editar tag e proyecto",
    addSuccessMsg: "¡Has añadido nuevo/s tag de proyecto/s!",
    fetchKey: "projects",
    empty: "Añade tags de proyecto a la plataforma"
  },
  apunte: {
    title: "Tags de apunte",
    addTitle: "Añadir tag de apunte",
    editSuccessMsg: "Editado correctamente",
    editTitle: "Editar tag de apunte",
    addSuccessMsg: "¡Has añadido nuevo/s tag de apunte/s!",
    fetchKey: "notes",
    empty: "Añade tags de apunte a la plataforma"
  }
}

const ORDER = {
  inheritance: "inheritance",
  alphabetic: "alphabetic"
}

const tags = () => {
  // Hooks

  const router = useRouter()
  const { type } = router.query
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { showToast } = useContext(ToastContext)
  const { deleteProjectTag, deleteNoteTag, createNoteTag, createProjectTag } =
    useTagApi()

  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const [activeTab, setActiveTab] = useState("inheritance")

  // Create - Update state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [tagToUpdate, setTagToUpdate] = useState(null)
  const [tagToDelete, setTagToDelete] = useState(null)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  // Fetch
  const isProjectTag = type === "proyecto"

  const { data, error, isLoading, mutate, isValidating } = tagFetchHandler(
    fetchState,
    fetchOptions,
    isProjectTag
  )

  const isEmptyData = checkDataIsEmpty(data)
  const tagData = data && !isEmptyData ? data : []

  let tagsByParent =
    tagData &&
    tagData
      .filter((tag) => tag?.relatedTags?.length > 0)
      .reduce((ac, tag) => {
        const parentName = tag?.name
        if (parentName) {
          ac[parentName] = tag.relatedTags
        }
        return ac
      }, {})
  tagsByParent = {
    ...tagData
      .filter((tag) => !tag?.parent && tag.relatedTags?.length === 0)
      .reduce((ac, tag) => {
        ac["zulu"] = ac["zulu"] ? [...ac["zulu"], tag] : [tag]
        return ac;
      }, {}),
    ...tagsByParent
  }

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const handleOnCloseModal = () => {
    setTagToUpdate(null)
    setIsTagModalOpen(false)
  }

  const handleOnOpenFilter = () => {
    setShowFilterModal(true)
  }

  // Handlers CRUD
  const handleImportTags = async (data) => {
    const func = isProjectTag ? createProjectTag : createNoteTag
    for (let index = 0; index < data.length; index++) {
      const tag = await func(data[index])
      if (tag.error) {
        showToast({
          message: `Ha habido un error en la fila ${
            index + 2
          }. La importación se ha cancelado a partir de esta fila.`,
          time: 5000
        })
        return
      }
    }

    setShowImportModal(false)
    showToast({ message: "Tags importadas correctamente" })
  }

  const handleExportTags = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformTagsToExport(tagData))
    download(_data, `tags_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  const handleDelete = async () => {
    try {
      isProjectTag
        ? await deleteProjectTag(tagToDelete)
        : await deleteNoteTag(tagToDelete)
      await mutate()
      showToast({ message: "Tag borrada correctamente" })
      setTagToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (tag) => {
    setTagToUpdate(tag)
    setIsTagModalOpen(true)
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

  const sortTags = (data) => {
    return data.sort((a, b) => a.name.localeCompare(b.name))
  }

  const handleOnFilter = (values) => {
    if (!values) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.FILTER]: null
      })
      return
    }

    const filter = generateFilterQuery(TAGS_FILTER_KEYS, values)

    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
    })

    setShowFilterModal(false)
  }

  useEffect(() => {
    if (!infoByType[router?.query?.type]) router.push(PATHS.notFound)
  }, [])

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={tagToDelete}
        onConfirm={handleDelete}
        onClose={() => setTagToDelete(null)}
      >
        {`¿Desea eliminar ${getFieldObjectById(tagData, "name", tagToDelete)}?`}
      </Popup>

      <TagsFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values) => handleOnFilter(values)}
      />

      <NewTagModal
        tagToUpdate={tagToUpdate}
        isOpen={isTagModalOpen}
        onClose={handleOnCloseModal}
        isProjectTag={isProjectTag}
        editSuccessMsg={infoByType[type].editSuccessMsg}
        editTitle={infoByType[type].editTitle}
        addSuccessMsg={infoByType[type].addSuccessMsg}
        addTitle={infoByType[type].addTitle}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportTags()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportTags(data)}
        onDropDataTransform={(info) => tagDataTransform(info)}
      />

      <PageHeader title={infoByType[type].title}>
        {isToolbarHidden() ? (
          <ToolBar
            onAdd={() => setIsTagModalOpen(true)}
            onSearch={onSearch}
            onFilter={handleOnOpenFilter}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel={infoByType[type].addTitle}
            searchPlaceholder="Busqueda por ID, Alias"
            noGroup
            icon={<AddTagIcon />}
            fetchState={fetchState}
          />
        ) : null}
      </PageHeader>
      {isLoading ? (
        <LoadingView mt="-200px" />
      ) : isEmptyData && !isValidating ? (
        <ViewEmptyState
          message={infoByType[router?.query?.type].empty}
          importButtonText="Importar"
          addButtonText={infoByType[router?.query?.type].addTitle}
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsTagModalOpen(true)}
        />
      ) : (
        <PageBody
          p={["16px", null, null, "32px"]}
          bgColor="white"
          boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
          height="calc(100vh - 155px)"
          mr={["14px", null, null, null]}
        >
          <TagsHeader
            activeItem={activeTab}
            onChange={(value) => setActiveTab(value)}
            tagsCount={tagData?.length}
          />

          {activeTab === ORDER.inheritance ? (
            <>
              <Text variant="d_s_medium">Primer Grado</Text>
              <Grid
                templateColumns={["auto", null, null, "repeat(auto-fill, 266px)"]}
                gap="16px"
                width="100%"
                mt="8px"
                mb="24px"
              >
                {tagData
                  .filter((tag) => tag?.relatedTags?.length > 0)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((tag) => (
                    <TagCard
                      onEdit={() => handleUpdate(tag)}
                      onDelete={() => setTagToDelete(tag._id)}
                      key={tag.name}
                      tag={tag}
                      isProjectTag={isProjectTag}
                    />
                  ))}
              </Grid>

              <Text variant="d_s_medium">Grado Cero</Text>
              {Object.entries(tagsByParent)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([groupName, tags]) => (
                  <Grid
                    templateColumns={[
                      "auto",
                      null,
                      null,
                      "repeat(auto-fill, 266px)"
                    ]}
                    gap="16px"
                    width="100%"
                    mt="8px"
                    mb="24px"
                    key={groupName}
                  >
                    {tags
                      // .sort((a, b) => a.name.localeCompare(b.name))
                      .map((tag) => (
                        <TagCard
                          onEdit={() => handleUpdate(tag)}
                          onDelete={() => setTagToDelete(tag._id)}
                          key={tag.name}
                          tag={tag}
                          isProjectTag={isProjectTag}
                        />
                      ))}
                  </Grid>
                ))}
            </>
          ) : null}

          {activeTab === ORDER.alphabetic ? (
            <Grid
              templateColumns={["auto", null, null, "repeat(auto-fill, 266px)"]}
              gap="16px"
              width="100%"
              mt="8px"
              mb="24px"
            >
              {sortTags(tagData).map((tag) => (
                <TagCard
                  onEdit={() => handleUpdate(tag)}
                  onDelete={() => setTagToDelete(tag._id)}
                  key={tag.name}
                  tag={tag}
                  isProjectTag={isProjectTag}
                />
              ))}
            </Grid>
          ) : null}
        </PageBody>
      )}
    </Page>
  )
}

export default tags
