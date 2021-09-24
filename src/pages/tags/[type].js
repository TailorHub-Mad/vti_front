import { Grid, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import React, { useContext, useEffect, useState } from "react"
import { TagCard } from "../../components/cards/TagCard/TagCard"
import { NoteDrawer } from "../../components/drawer/NoteDrawer/NoteDrawer"
import { AddTagIcon } from "../../components/icons/AddTagIcon"
import { Page } from "../../components/layout/Pages/Page"
import { PageBody } from "../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../../components/overlay/Popup/Popup"
import useTagApi from "../../hooks/api/useTagApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { tagFetchHandler } from "../../swr/tag.swr"
import { DeleteType } from "../../utils/constants/global"
import { errorHandler } from "../../utils/errors"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { LoadingView } from "../../views/common/LoadingView"
import { NewTagModal } from "../../views/tags/NewTag/NewTagModal/NewTagModal"
import { TagsHeader } from "../../views/tags/TagsHeader/TagsHeader"

const tagsProyecto = () => {
  const router = useRouter()
  const { type } = router.query
  const isProjectTag = type === "proyecto"

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

  const [activeTab, setActiveTab] = useState("inheritance")
  const [showNoteDetails, setShowNoteDetails] = useState(null)
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { showToast } = useContext(ToastContext)
  const { deleteProjectTag, deleteNoteTag } = useTagApi()
  const { data, error, isLoading, mutate } = tagFetchHandler(
    infoByType[type].fetchKey
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [tagToUpdate, setTagToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [tagToDelete, setTagsToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const tagData = data && !isEmptyData ? data : null
  //TODO Comentar el fetchType para tags

  const handleExport = () => {}

  const handleOpenPopup = (tagToDelete, type) => {
    setDeleteType(type)
    setTagsToDelete(tagToDelete)
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
    const label = getFieldObjectById(tagData, "alias", tagToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    // const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    // const updated = await f(tagToDelete, tagData)
    const updated = await deleteOne(tagToDelete, tagData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setTagsToDelete(null)
  }

  const deleteOne = async (id, projectTag) => {
    try {
      ;(await isProjectTag) ? deleteProjectTag(id) : deleteNoteTag(id)
      showToast("Tag borrada correctamente")
      return projectTag.filter((projectTag) => projectTag._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  //   const deleteMany = async (projectTagId, projectTag) => {
  //     try {
  //       const projectTagQueue = projectTagId.map((id) => deleteProjectTag(id))
  //       await Promise.all(projectTagQueue)
  //       showToast("Tags borradas correctamente")
  //       return projectTag.filter(
  //         (projectTag) => !projectTagId.includes(projectTag._id)
  //       )
  //     } catch (error) {
  //       errorHandler(error)
  //     }
  //   }

  const onEdit = (id) => {
    const tag = tagData.find((tag) => tag._id === id)
    setTagToUpdate(tag)
    setIsTagModalOpen(true)
  }

  const onSearch = () => {
    // setFetchState(fetchType.SEARCH)
    // setFetchOptions({
    //   [fetchOption.SEARCH]: search
    // })
  }

  useEffect(() => {
    if (!infoByType[router?.query?.type]) {
      router.push("/404")
    }
  }, [])
  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
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
      <PageHeader title={infoByType[type].title}>
        {data && !isLoading ? (
          <ToolBar
            onAdd={() => setIsTagModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel={infoByType[type].addTitle}
            searchPlaceholder="Busqueda por ID, Alias"
            noFilter
            noGroup
            icon={<AddTagIcon />}
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
          <TagsHeader
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
                  <TagCard
                    onEdit={() => onEdit(tag._id)}
                    onDelete={() => handleOpenPopup(tag._id, DeleteType.ONE)}
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
                .filter((tag) => !tag.parentTag)
                .map((tag) => (
                  <TagCard
                    onEdit={() => onEdit(tag._id)}
                    onDelete={() => handleOpenPopup(tag._id, DeleteType.ONE)}
                    key={tag.name}
                    {...tag}
                  />
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
                <TagCard
                  onEdit={() => onEdit(tag._id)}
                  onDelete={() => handleOpenPopup(tag._id, DeleteType.ONE)}
                  key={tag.name}
                  {...tag}
                />
              ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default tagsProyecto
