import { Box, Flex, Grid, Text } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { Page } from "../components/layout/Pages/Page"
import { PageBody } from "../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../components/layout/Pages/PageHeader/PageHeader"
import { ToolBar } from "../components/navigation/ToolBar/ToolBar"
import { ImportFilesModal } from "../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../components/overlay/Popup/Popup"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { DeleteType } from "../utils/constants/global"
import { getFieldObjectById } from "../utils/functions/global"
import { AddCriterionIcon } from "../components/icons/AddCriterionIcon"
import { CriteriaHeader } from "../views/criteria/CriteriaHeader/CriteriaHeader"
import faker from "faker"
import { Tag } from "../components/tags/Tag/Tag"
import { CriterionTitleCard } from "../components/cards/CriterionTitleCard/Criterion"
const tagsMock = new Array(50).fill("").map(() => faker.random.word())

const apoyo = () => {
  // const router = useRouter()
  // const { type } = router.query
  // const isProjectTag = type === "proyecto"

  // const infoByType = {
  //   proyecto: {
  //     title: "Tags de proyecto",
  //     addTitle: "Añadir tag de proyecto",
  //     editSuccessMsg: "Editado correctamente",
  //     editTitle: "Editar tag e proyecto",
  //     addSuccessMsg: "¡Has añadido nuevo/s tag de proyecto/s!",
  //     fetchKey: "projects"
  //   },
  //   apunte: {
  //     title: "Tags de apunte",
  //     addTitle: "Añadir tag de apunte",
  //     editSuccessMsg: "Editado correctamente",
  //     editTitle: "Editar tag de apunte",
  //     addSuccessMsg: "¡Has añadido nuevo/s tag de apunte/s!",
  //     fetchKey: "notes"
  //   }
  // }

  const [activeTab, setActiveTab] = useState("board")
  const { isLoggedIn } = useContext(ApiAuthContext)
  // const { showToast } = useContext(ToastContext)
  //TODO Meter la api de criterio
  // const { deleteProjectTag, deleteNoteTag } = useTagApi()
  // const { data, error, isLoading, mutate } = tagFetchHandler(
  //   infoByType[type].fetchKey
  // )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [, setIsCriterioModalOpen] = useState(false)
  const [, setCriterioToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [criterioToDelete, setCriteriosToDelete] = useState(null)

  // TODO -> provisonal
  // const isEmptyData = checkDataIsEmpty(data)
  // const criterioData = data && !isEmptyData ? data : null
  const isEmptyData = true
  const criterioData = isEmptyData && null

  const handleExport = () => {}

  const handleOpenPopup = (criterioToDelete, type) => {
    setDeleteType(type)
    setCriteriosToDelete(criterioToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setCriteriosToDelete(null)
  }

  // const handleOnCloseModal = () => {
  //   setCriterioToUpdate(null)
  //   setIsCriterioModalOpen(false)
  // }

  const handleDeleteMessage = () => {
    if (!criterioToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los tags seleccionados?"
    const label = getFieldObjectById(criterioData, "alias", criterioToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    // const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    // const updated = await f(criterioToDelete, criterioData)
    // const updated = await deleteOne(criterioToDelete, criterioData)
    // updated.length > 0 ? await mutate(updated, false) : await mutate()
    // setDeleteType(null)
    // setCriteriosToDelete(null)
  }

  // const deleteOne = async () => {
  //   try {
  //     ;(await isProjectTag) ? deleteProjectTag(id) : deleteNoteTag(id)
  //     showToast("Tag borrada correctamente")
  //     return projectTag.filter((projectTag) => projectTag._id !== id)
  //   } catch (error) {
  //     errorHandler(error)
  //   }
  // }

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

  const handleUpdate = (id) => {
    const tag = criterioData.find((tag) => tag._id === id)
    setCriterioToUpdate(tag)
    setIsCriterioModalOpen(true)
  }

  const onSearch = () => {
    // setFetchState(fetchType.SEARCH)
    // setFetchOptions({
    //   [fetchOption.SEARCH]: search
    // })
  }

  if (!isLoggedIn) return null
  // if (error) return errorHandler(error)
  return (
    <Page>
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
      {/* <NewTagModal
        criterioToUpdate={criterioToUpdate}
        isOpen={isCriterioModalOpen}
        onClose={handleOnCloseModal}
        isProjectTag={isProjectTag}
        editSuccessMsg={infoByType[type].editSuccessMsg}
        editTitle={infoByType[type].editTitle}
        addSuccessMsg={infoByType[type].addSuccessMsg}
        addTitle="Añadir criterio"
      /> */}
      <PageHeader title="Apoyo">
        {/* {data && !isLoading ? ( */}
        <ToolBar
          onAdd={() => setIsCriterioModalOpen(true)}
          onSearch={onSearch}
          onImport={() => setShowImportModal(true)}
          onExport={handleExport}
          addLabel="Añadir criterio"
          searchPlaceholder="Busqueda por tag, Título..."
          noFilter
          noGroup
          icon={<AddCriterionIcon />}
        />
        {/* ) : null} */}
      </PageHeader>
      {/* {isLoading ? <LoadingView mt="-200px" /> : null} */}
      {/* {!data ? <NotesEmptyState /> : null} */}
      <PageBody
        p="32px"
        bgColor="white"
        boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
        height="calc(100vh - 105px)"
      >
        {/* {data && !isLoading && ( */}
        <CriteriaHeader
          activeItem={activeTab}
          onChange={(value) => setActiveTab(value)}
          // tagsCount={data.length}
          tagsCount={55}
        />
        {/* )} */}
        <Box mb="40px">
          <Text variant="d_m_medium" mb="8px">
            Tags no utilizados
          </Text>
          <Flex width="100%" wrap="wrap">
            {tagsMock.map((tag, idx) => (
              <Tag key={`${tag}-${idx}`} variant="violete" mr="8px" mb="8px">
                {tag}
              </Tag>
            ))}
          </Flex>
        </Box>

        <Grid
          templateColumns="repeat(auto-fill, 266px)"
          gap="16px"
          width="100%"
          mt="8px"
          mb="24px"
        >
          {tagsMock.map((tag) => (
            <CriterionTitleCard
              onEdit={() => handleUpdate(tag._id)}
              onDelete={() => handleOpenPopup(tag._id, DeleteType.ONE)}
              key={tag.name}
              {...tag}
            />
          ))}
        </Grid>
      </PageBody>
    </Page>
  )
}

export default apoyo
