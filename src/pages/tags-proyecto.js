import { Grid, Text } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { TagCard } from "../components/cards/TagCard/TagCard"
import { NoteDrawer } from "../components/drawer/NoteDrawer/NoteDrawer"
import { AddClientIcon } from "../components/icons/AddClientIcon"
import { Page } from "../components/layout/Pages/Page"
import { PageBody } from "../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../components/layout/Pages/PageHeader/PageHeader"
import { ToolBar } from "../components/navigation/ToolBar/ToolBar"
import { ImportFilesModal } from "../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../components/overlay/Popup/Popup"
import useTagApi from "../hooks/api/useTagApi"
// import { data } from "../mock/tags"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { ToastContext } from "../provider/ToastProvider"
import { tagFetchHandler } from "../swr/tag.swr"
import { DeleteType } from "../utils/constants/global_config"
import { errorHandler } from "../utils/errors"
import { checkDataIsEmpty, getFieldObjectById } from "../utils/functions/common"
import { LoadingView } from "../views/common/LoadingView"
import { NewProjectTagModal } from "../views/project_tags/NewProjectTag/NewProjectTagModal/NewProjectTagModal"
import { ProjectsTagsHeader } from "../views/project_tags/ProjectTagsHeader/ProjectTagsHeader"

const tagsProyecto = () => {
  const [activeTab, setActiveTab] = useState("inheritance")
  const [showNoteDetails, setShowNoteDetails] = useState(null)
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { showToast } = useContext(ToastContext)
  const { deleteProjectTag } = useTagApi()
  const { data, error, isLoading, mutate } = tagFetchHandler("projects")

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isProjectTagModalOpen, setIsProjectTagModalOpen] = useState(false)
  const [projectTagToUpdate, setProjectTagToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [projectTagToDelete, setProjectTagsToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const projectTagData = data && !isEmptyData ? data : null
  //TODO Comentar el fetchType para tags

  const handleExport = () => {}

  const handleOpenPopup = (projectTagToDelete, type) => {
    setDeleteType(type)
    setProjectTagsToDelete(projectTagToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setProjectTagsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setProjectTagToUpdate(null)
    setIsProjectTagModalOpen(false)
  }

  const handleDeleteMessage = () => {
    if (!projectTagToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los projectTages seleccionados?"
    const label = getFieldObjectById(projectTagData, "alias", projectTagToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(projectTagToDelete, projectTagData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setProjectTagsToDelete(null)
  }

  const deleteOne = async (id, projectTag) => {
    try {
      await deleteProjectTag(id)
      showToast("ProjectTage borrado correctamente")
      return projectTag.filter((projectTag) => projectTag._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (projectTagId, projectTag) => {
    try {
      const projectTagQueue = projectTagId.map((id) => deleteProjectTag(id))
      await Promise.all(projectTagQueue)
      showToast("ProjectTages borrados correctamente")
      return projectTag.filter(
        (projectTag) => !projectTagId.includes(projectTag._id)
      )
    } catch (error) {
      errorHandler(error)
    }
  }

  const onEdit = (id) => {
    const projectTag = projectTagData.find((projectTag) => projectTag._id === id)
    setProjectTagToUpdate(projectTag)
    setIsProjectTagModalOpen(true)
  }

  const onSearch = (search) => {
    // setFetchState(fetchType.SEARCH)
    // setFetchOptions({
    //   [fetchOption.SEARCH]: search
    // })
  }

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  console.log(data)
  return (
    <Page>
      <NoteDrawer
        isOpen={showNoteDetails}
        onClose={() => setShowNoteDetails(null)}
      />
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={deleteType}
        onConfirm={handleDeleteFunction}
        onClose={handleClosePopup}
      >
        {handleDeleteMessage()}
      </Popup>
      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
      <NewProjectTagModal
        projectTagToUpdate={projectTagToUpdate}
        isOpen={isProjectTagModalOpen}
        onClose={handleOnCloseModal}
      />
      <PageHeader title="Tags de Proyecto">
        {data && !isLoading ? (
          <ToolBar
            onAdd={() => setIsProjectTagModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir tag de proyecto"
            searchPlaceholder="Busqueda por ID, Alias"
            noFilter
            noGroup
            icon={<AddClientIcon />}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {/* {!data ? <NotesEmptyState /> : null} */}
      <PageBody
        p="32px"
        bgColor="white"
        boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
        height="calc(100vh - 105px)"
      >
        {data && !isLoading && (
          <ProjectsTagsHeader
            activeItem={activeTab}
            onChange={(value) => setActiveTab(value)}
            tagsCount={data.length}
          />
        )}
        {data && !isLoading && activeTab === "inheritance" ? (
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
                .filter((tag) => tag.parentTag)
                .map((tag) => (
                  <TagCard key={tag.name} {...tag} />
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
                .filter((tag) => !tag.parentTag)
                .map((tag) => (
                  <TagCard key={tag.name} {...tag} />
                ))}
            </Grid>
          </>
        ) : null}
        {data && !isLoading && activeTab === "alphabetic" ? (
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
                <TagCard key={tag.name} {...tag} />
              ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default tagsProyecto
