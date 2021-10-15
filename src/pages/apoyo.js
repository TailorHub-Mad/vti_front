import { Box, Flex, Grid, Text } from "@chakra-ui/react"
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
import { CriterionTitleCard } from "../components/cards/CriterionTitleCard/Criterion"
import { fetchOption, fetchType } from "../utils/constants/swr"
import { errorHandler } from "../utils/errors"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"
import {
  helpDataTransform,
  transformHelpsToExport
} from "../utils/functions/import_export/help_helpers"
import { helpFetchHandler } from "../swr/help.swr"
import useHelpApi from "../hooks/api/useHelpApi"
import { ToastContext } from "../provider/ToastProvider"
import { NewHelpModal } from "../views/helps/NewHelp/NewHelpModal/NewHelpModal"
import { ExportFilesModal } from "../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import { BreadCrumbs } from "../components/navigation/BreadCrumbs/BreadCrumbs"
import { LoadingView } from "../views/common/LoadingView"
import { ViewNotFoundState } from "../views/common/ViewNotFoundState"
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
  const { deleteProjectHelp, deleteNoteHelp, createNoteHelp, createProjectHelp } =
    useHelpApi()
  const { showToast } = useContext(ToastContext)

  // States
  const [activeTab, setActiveTab] = useState(HELP_MENU_TABS.projects_board)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [helpToUpdate, setHelpToUpdate] = useState(null)
  const [helpToDelete, setHelpToDelete] = useState(null)
  const [tagsNotWork, setTagsNotWork] = useState([])
  const [isProjectHelp, setIsProjectHelp] = useState(true)

  // Fetch
  const { data, error, isLoading, mutate } = helpFetchHandler(
    fetchState,
    fetchOptions,
    isProjectHelp
  )

  const isEmptyData = checkDataIsEmpty(data)
  const helpsData = data && !isEmptyData ? data : null

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleActiveTab = (value) => {
    setActiveTab(value)

    if (value.includes(HELP_MENU_TABS.projects_board)) setIsProjectHelp(true)
    else setIsProjectHelp(false)
  }

  const handleOnCloseModal = () => {
    setHelpToUpdate(null)
    setIsHelpModalOpen(false)
  }

  // Handlers CRUD
  const sortTags = (data) => {
    return data.sort((a, b) => a.name.localeCompare(b.name))
  }

  const handleImportHelps = async (data) => {
    //TODO Gestión de errores y update de SWR

    try {
      const func = isProjectHelp ? createProjectHelp : createNoteHelp
      for (let index = 0; index < data.length; index++) {
        await await func(data[index])
      }

      setShowImportModal(false)
      showToast("Criterios importadas correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportHelps = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformHelpsToExport(helpsData))
    download(_data, `helps_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  const handleDelete = async () => {
    try {
      isProjectHelp
        ? await deleteProjectHelp(helpToDelete)
        : await deleteNoteHelp(helpToDelete)
      await mutate()
      showToast("Help borrada correctamente")
      setHelpToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const help = helpsData.find((help) => help._id === id)
    setHelpToUpdate(help)
    setIsHelpModalOpen(true)
  }

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

  // TODO
  useEffect(() => {
    setTagsNotWork([])
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
        isOpen={helpToDelete}
        onConfirm={handleDelete}
        onClose={() => setHelpToDelete(null)}
      >
        {`¿Desea eliminar ${getFieldObjectById(helpsData, "ref", helpToDelete)}?`}
      </Popup>

      <NewHelpModal
        helpToUpdate={helpToUpdate}
        isOpen={isHelpModalOpen}
        onClose={handleOnCloseModal}
        addTitle="Añadir nuevo criterio"
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportHelps()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportHelps(data)}
        onDropDataTransform={(info) => helpDataTransform(info)}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden() && (
          <ToolBar
            onAdd={() => setIsHelpModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir criterio"
            searchPlaceholder="Busqueda por ID, Proyecto"
            icon={<AddCriterionIcon />}
            fetchState={fetchState}
            noGroup
            noFilter
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
        {isEmptyData && isSearch ? (
          <ViewNotFoundState />
        ) : isEmptyData ? (
          <ViewEmptyState
            message="Añadir criterios a la plataforma"
            importButtonText="Importar"
            addButtonText="Añadir criterio"
            onImport={() => setShowImportModal(true)}
            onAdd={() => setIsHelpModalOpen(true)}
          />
        ) : null}

        {helpsData ? (
          <>
            <HelpHeader
              activeItem={activeTab}
              onChange={handleActiveTab}
              tagsCount={helpsData.length}
            />

            {tagsNotWork.length > 0 ? (
              <Box mb="40px">
                <Text variant="d_m_medium" mb="8px">
                  Tags no utilizados
                </Text>
                <Flex width="100%" wrap="wrap">
                  {tagsNotWork.map((tag, idx) => (
                    <Tag key={`${tag}-${idx}`} variant="violete" mr="8px" mb="8px">
                      {tag.name}
                    </Tag>
                  ))}
                </Flex>
              </Box>
            ) : null}

            <Grid
              templateColumns="repeat(auto-fill, 266px)"
              gap="16px"
              width="100%"
              mt="8px"
              mb="24px"
            >
              {activeTab.includes(ORDER.board)
                ? helpsData.map((help) => (
                    <CriterionTitleCard
                      help={help}
                      onAdd={() => setIsHelpModalOpen(true)}
                      onEdit={() => handleUpdate(help._id)}
                      onDelete={() => setHelpToDelete(help._id)}
                      key={help.name}
                    />
                  ))
                : null}

              {activeTab.includes(ORDER.alphabetic)
                ? sortTags(helpsData).map((help) => (
                    <CriterionTitleCard
                      help={help}
                      onAdd={() => setIsHelpModalOpen(true)}
                      onEdit={() => handleUpdate(help._id)}
                      onDelete={() => setHelpToDelete(help._id)}
                      key={help.name}
                    />
                  ))
                : null}
            </Grid>
          </>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default apoyo
