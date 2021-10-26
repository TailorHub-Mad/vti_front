import { Box, Flex, Text } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { Page } from "../components/layout/Pages/Page"
import { PageBody } from "../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../components/layout/Pages/PageHeader/PageHeader"
import { ToolBar } from "../components/navigation/ToolBar/ToolBar"
import { ImportFilesModal } from "../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../components/overlay/Popup/Popup"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { checkDataIsEmpty, getFieldObjectById } from "../utils/functions/global"
import { AddCriterionIcon } from "../components/icons/AddCriterionIcon"
import { HelpHeader } from "../views/helps/HelpHeader/HelpHeader"
import { Tag } from "../components/tags/Tag/Tag"
import { helpDataTransform } from "../utils/functions/import_export/help_helpers"
import useHelpApi from "../hooks/api/useHelpApi"
import { ToastContext } from "../provider/ToastProvider"
import { NewCriterionModal } from "../views/helps/NewCriterion/NewCriterionModal/NewCriterionModal"
import { ExportFilesModal } from "../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import { BreadCrumbs } from "../components/navigation/BreadCrumbs/BreadCrumbs"
import { LoadingView } from "../views/common/LoadingView"
import { CriterionContainer } from "../views/helps/CriterionContainer/CriterionContainer"
import { TagsAlphabeticContainer } from "../views/tags/TagsAlphabeticContainer/TagsAlphabeticContainer"
import useTagApi from "../hooks/api/useTagApi"
import { ViewEmptyState } from "../views/common/ViewEmptyState"

const HELP_MENU_TABS = {
  projects_board: "projects_board",
  projects_alphabetic: "projects_alphabetic",
  notes_board: "notes_board",
  notes_alphabetic: "notes_alphabetic"
}

const ORDER = {
  board: "board",
  alphabetic: "alphabetic"
}

const apoyo = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const {
    deleteProjectCriterion,
    deleteNoteCriterion,
    updateNoteCriterion,
    updateProjectCriterion,
    getNoteHelps,
    getProjectHelps,
    getProjectTags,
    getNoteTags
  } = useHelpApi()

  const { deleteProjectTag, deleteNoteTag } = useTagApi()
  const { showToast } = useContext(ToastContext)

  // States
  const [activeTab, setActiveTab] = useState(HELP_MENU_TABS.notes_board)
  const isProjectCriteria =
    activeTab === HELP_MENU_TABS.projects_board ||
    activeTab === HELP_MENU_TABS.projects_alphabetic

  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isCriterionModalOpen, setIsCriterionModalOpen] = useState(false)
  const [unusedTags, setUnusedTags] = useState([])
  const [usedTags, setUsedTags] = useState([])
  const [criterionToDelete, setCriterionToDelete] = useState(null)
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  const updateCriterionOrder = async (isProject, _criterion) => {
    const _criterionToUpdate = {
      ..._criterion,
      group: _criterion.group.map((gr) => ({
        ...gr,
        relatedTags: gr.relatedTags.map((rt) => rt._id)
      }))
    }
    if (isProject) {
      await updateProjectCriterion(_criterion._id, _criterionToUpdate)
    } else {
      await updateNoteCriterion(_criterion._id, _criterionToUpdate)
    }
  }
  const handleMoveCriterion = async (_id, _data, up) => {
    const indexToMove = _data.findIndex((item) => item._id === _id)
    const arr = [..._data]
    if (indexToMove === -1) return arr
    if (up && indexToMove !== 0) {
      arr[indexToMove - 1] = { ...arr[indexToMove - 1], order: indexToMove + 1 }
      arr[indexToMove] = { ...arr[indexToMove], order: indexToMove - 1 }
      await updateCriterionOrder(isProjectCriteria, arr[indexToMove - 1])
      await updateCriterionOrder(isProjectCriteria, arr[indexToMove])
    }
    if (!up && indexToMove !== _data.length - 1) {
      arr[indexToMove + 1] = { ...arr[indexToMove + 1], order: indexToMove - 1 }
      arr[indexToMove] = { ...arr[indexToMove], order: indexToMove + 1 }
      await updateCriterionOrder(isProjectCriteria, arr[indexToMove + 1])
      await updateCriterionOrder(isProjectCriteria, arr[indexToMove])
    }

    setData(arr)
  }

  const isEmptyData = checkDataIsEmpty(data)
  const criteriaData = data && !isEmptyData ? data : null
  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData) return false

    return true
  }

  const handleActiveTab = (value) => {
    setActiveTab(value)
  }

  const handleOnCloseModal = () => {
    setIsCriterionModalOpen(false)
  }

  // const handleImportHelps = async (data) => {
  //

  //   try {
  //     const func = isProjectCriteria ? createProjectHelp : createNoteHelp
  //     for (let index = 0; index < data.length; index++) {
  //       await await func(data[index])
  //     }

  //     setShowImportModal(false)
  //     showToast("Criterios importados correctamente")
  //   } catch (error) {
  //     errorHandler(error)
  //   }
  // }

  // const handleExportHelps = () => {
  //   setShowExportModal(false)
  //   const _data = jsonToCSV(transformHelpsToExport(criteriaData))
  //   download(_data, `helps_export_${new Date().toLocaleDateString()}`, "text/csv")
  // }

  const fetchCriteria = async () => {
    setIsLoading(true)
    setData(null)
    const _data = isProjectCriteria ? await getProjectHelps() : await getNoteHelps()
    setData(_data)
    setIsLoading(false)
  }

  const fetchTags = async () => {
    const _tags = isProjectCriteria ? await getProjectTags() : await getNoteTags()
    setUnusedTags(_tags.filter((tag) => !tag.isUsed))
    setUsedTags(_tags.filter((tag) => tag.isUsed))
  }

  const handleDelete = async () => {
    isProjectCriteria
      ? await deleteProjectCriterion(criterionToDelete)
      : await deleteNoteCriterion(criterionToDelete)
    showToast("Criterio eliminado correctamente")
    setData(data.filter((cr) => cr._id !== criterionToDelete))
    setCriterionToDelete(null)
  }

  const handleTagsDelete = async (tags) => {
    const _tagsToDelete = tags.map((t) => {
      const [_t] = usedTags.filter((ut) => ut.name === t)
      return _t._id
    })
    const _deletePromises = isProjectCriteria
      ? _tagsToDelete.map((tag) => deleteProjectTag(tag))
      : _tagsToDelete.map((tag) => deleteNoteTag(tag))
    await Promise.all(_deletePromises)
    fetchTags()
  }

  useEffect(() => {
    fetchCriteria()
  }, [isProjectCriteria])

  useEffect(() => {
    fetchTags(isProjectCriteria)
  }, [isProjectCriteria, data])

  if (!isLoggedIn) return null
  // if (error) return errorHandler(error)
  return (
    <Page>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={criterionToDelete}
        onConfirm={handleDelete}
        onClose={() => setCriterionToDelete(null)}
      >
        {`¿Desea eliminar ${getFieldObjectById(
          criteriaData,
          "title",
          criterionToDelete
        )}?`}
      </Popup>

      <NewCriterionModal
        isOpen={isCriterionModalOpen}
        onClose={handleOnCloseModal}
        addTitle="Añadir nuevo criterio"
        addSuccessMsg="Criterio añadido satisfactoriamente"
        onSuccessCreate={() => fetchCriteria()}
        criteria={data}
        isProjectCriteria={isProjectCriteria}
        isCreation
        fetchData={() => fetchCriteria()}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        // onExport={() => handleExportHelps()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        // onUpload={(data) => handleImportHelps(data)}
        onDropDataTransform={(info) => helpDataTransform(info)}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden() && (
          <ToolBar
            onAdd={() => setIsCriterionModalOpen(true)}
            // onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir criterio"
            searchPlaceholder="Busqueda por ID, Proyecto"
            icon={<AddCriterionIcon />}
            // fetchState={fetchState}
            noGroup
            noFilter
            noSearch
            noImport
          />
        )}
      </PageHeader>
      <PageBody
        p="32px"
        bgColor="white"
        boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
        height="calc(100vh - 105px)"
      >
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {isEmptyData ? (
          <ViewEmptyState
            message="Añadir criterios a la plataforma"
            importButtonText="Importar"
            addButtonText="Añadir criterio"
            onImport={() => setShowImportModal(true)}
            onAdd={() => setIsCriterionModalOpen(true)}
          />
        ) : (
          <>
            <HelpHeader
              activeItem={activeTab}
              onChange={handleActiveTab}
              tagsCount={unusedTags?.length + usedTags?.length}
            />

            {unusedTags.length > 0 ? (
              <Box mb="40px">
                <Text variant="d_m_medium" mb="8px">
                  Tags no utilizados
                </Text>
                <Flex width="100%" wrap="wrap">
                  {unusedTags.map((tag, idx) => (
                    <Tag key={`${tag}-${idx}`} variant="violete" mr="8px" mb="8px">
                      {tag.name}
                    </Tag>
                  ))}
                </Flex>
              </Box>
            ) : null}

            {activeTab.includes(ORDER.board)
              ? data
                  .sort((a, b) => (b.order > a.order ? -1 : 1))
                  .map((criterion) => (
                    <CriterionContainer
                      fetchData={() => fetchCriteria()}
                      criteria={data}
                      updateCriteria={(_data) => setData(_data)}
                      key={criterion._id}
                      criterion={criterion}
                      unusedTags={unusedTags}
                      usedTags={usedTags}
                      isProjectCriteria={isProjectCriteria}
                      onDelete={() => setCriterionToDelete(criterion._id)}
                      onMoveUp={() => handleMoveCriterion(criterion._id, data, true)}
                      onMoveDown={() =>
                        handleMoveCriterion(criterion._id, data, false)
                      }
                    />
                  ))
              : null}

            {activeTab.includes(ORDER.alphabetic) ? (
              <TagsAlphabeticContainer tags={usedTags} onDelete={handleTagsDelete} />
            ) : null}
          </>
        )}
      </PageBody>
    </Page>
  )
}

export default apoyo
