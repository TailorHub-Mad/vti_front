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
import { DeleteType, PATHS } from "../../utils/constants/global"
import { errorHandler } from "../../utils/errors"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import {
  tagDataTransform,
  transformTagsToExport
} from "../../utils/functions/import_export/tags_helper"
import { LoadingView } from "../../views/common/LoadingView"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { NewTagModal } from "../../views/tags/NewTag/NewTagModal/NewTagModal"
import { TagsHeader } from "../../views/tags/TagsHeader/TagsHeader"
import download from "downloadjs"
import { generateFilterQueryObj } from "../../utils/functions/filter"
import { generateQueryStr } from "../../utils/functions/global"
import { TagsFilterModal } from "../../views/tags/TagsFilter/TagsFilterModal"
import { TAGS_FILTER_KEYS } from "../../utils/constants/filter"

const infoByType = {
  proyecto: {
    title: "Tags de proyecto",
    addTitle: "Añadir tag de proyecto",
    editSuccessMsg: "Editado correctamente",
    editTitle: "Editar tag e proyecto",
    addSuccessMsg: "¡Has añadido nuevo/s tag de proyecto/s!",
    fetchKey: "projects"
  },
  apunte: {
    title: "Tags de apunte",
    addTitle: "Añadir tag de apunte",
    editSuccessMsg: "Editado correctamente",
    editTitle: "Editar tag de apunte",
    addSuccessMsg: "¡Has añadido nuevo/s tag de apunte/s!",
    fetchKey: "notes"
  }
}

const tags = () => {
  const router = useRouter()
  const { type } = router.query
  const isProjectTag = type === "proyecto"

  const { isLoggedIn } = useContext(ApiAuthContext)
  const { showToast } = useContext(ToastContext)
  const { deleteProjectTag, deleteNoteTag, createNoteTag, createProjectTag } =
    useTagApi()
  const { data, error, isLoading, mutate } = tagFetchHandler(
    infoByType[type].fetchKey
  )

  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  const [activeTab, setActiveTab] = useState("inheritance")

  // Create - Update state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [tagToUpdate, setTagToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [tagToDelete, setTagsToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const tagData = data && !isEmptyData ? data : null

  // TODO
  const handleImportTags = async (data) => {
    //TODO Gestión de errores y update de SWR

    try {
      const tagsCreated = []
      for (let index = 0; index < data.length; index++) {
        const pro = isProjectTag
          ? await createProjectTag(data[index])
          : await createNoteTag(data[index])
        tagsCreated.push(pro)
      }

      setShowImportModal(false)
      showToast("Tags importadas correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportTags = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformTagsToExport(tagData))
    download(_data, `tags_export_${new Date().toLocaleDateString()}`, "text/csv")
  }
  const handleClosePopup = () => {
    setDeleteType(null)
    setTagsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setTagToUpdate(null)
    setIsTagModalOpen(false)
  }

  const handleDeleteMessage = () => {
    if (!tagToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los tags seleccionados?"
    const label = getFieldObjectById(tagData, "name", tagToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDelete = async () => {
    try {
      isProjectTag
        ? await deleteProjectTag(tagToDelete)
        : await deleteNoteTag(tagToDelete)
      const updated = tagData.filter((projectTag) => projectTag._id !== tagToDelete)
      updated.length > 0 ? await mutate(updated, false) : await mutate()
      showToast("Tag borrada correctamente")
      setDeleteType(null)
      setTagsToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (tag) => {
    setTagToUpdate(tag)
    setIsTagModalOpen(true)
  }

  // TODO
  const onSearch = () => {}

  const handleOnFilter = (values) => {
    console.log(generateQueryStr(generateFilterQueryObj(TAGS_FILTER_KEYS, values)))
    // setFetchState(fetchType.FILTER)
    // setFetchOptions({
    //   [fetchOption.FILTER]: filter
    // })
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
        onClose={handleClosePopup}
      >
        {handleDeleteMessage()}
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
        {tagData ? (
          <ToolBar
            onAdd={() => setIsTagModalOpen(true)}
            onSearch={onSearch}
            onFilter={() => setShowFilterModal(true)}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel={infoByType[type].addTitle}
            searchPlaceholder="Busqueda por ID, Alias"
            noGroup
            icon={<AddTagIcon />}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {isEmptyData ? (
        <ViewEmptyState
          message="Añadir tags a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir tag"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsTagModalOpen(true)}
        />
      ) : null}
      {tagData ? (
        <PageBody
          p="32px"
          bgColor="white"
          boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
          height="calc(100vh - 105px)"
        >
          <TagsHeader
            activeItem={activeTab}
            onChange={(value) => setActiveTab(value)}
            tagsCount={data.length}
          />

          {activeTab === "inheritance" ? (
            <>
              <Text variant="d_s_medium">Primer Grado</Text>
              <Grid
                templateColumns="repeat(auto-fill, 266px)"
                gap="16px"
                width="100%"
                mt="8px"
                mb="24px"
              >
                {data
                  .filter((tag) => tag?.relatedTags?.length > 0)
                  .map((tag) => (
                    <TagCard
                      onEdit={() => handleUpdate(tag)}
                      onDelete={() => setTagsToDelete(tag._id)}
                      key={tag.name}
                      {...tag}
                    />
                  ))}
              </Grid>

              <Text variant="d_s_medium">Grado Cero</Text>
              <Grid
                templateColumns="repeat(auto-fill, 266px)"
                gap="16px"
                width="100%"
                mt="8px"
                mb="24px"
              >
                {data
                  .filter((tag) => tag?.relatedTags?.length === 0)
                  .map((tag) => (
                    <TagCard
                      onEdit={() => handleUpdate(tag)}
                      onDelete={() => setTagsToDelete(tag._id)}
                      key={tag.name}
                      {...tag}
                    />
                  ))}
              </Grid>
            </>
          ) : null}

          {activeTab === "alphabetic" ? (
            <Grid
              templateColumns="repeat(auto-fill, 266px)"
              gap="16px"
              width="100%"
              mt="8px"
              mb="24px"
            >
              {[...data]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tag) => (
                  <TagCard
                    onEdit={() => handleUpdate(tag)}
                    onDelete={() => setTagsToDelete(tag._id)}
                    key={tag.name}
                    {...tag}
                  />
                ))}
            </Grid>
          ) : null}
        </PageBody>
      ) : null}
    </Page>
  )
}

export default tags
