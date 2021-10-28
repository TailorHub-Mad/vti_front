import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { ToastContext } from "../../provider/ToastProvider"
import { CodesTable } from "../../views/codes/CodesTable/CodesTable"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { NewCodeModal } from "../../views/codes/NewCode/NewCodeModal/NewCodeModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import useCodeApi from "../../hooks/api/useCodeApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { DeleteType } from "../../utils/constants/global"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { AddSectorIcon } from "../../components/icons/AddSectorIcon"
import { codeFetchHandler } from "../../swr/code.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"
import {
  codeDataTransform,
  transformCodesToExport
} from "../../utils/functions/import_export/codes_helper"
import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"
import useTableActions from "../../hooks/useTableActions"

const codigos = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteCode, createCode } = useCodeApi()
  const { showToast } = useContext(ToastContext)

  // States
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)
  const [codeToUpdate, setCodeToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [codesToDelete, setCodesToDelete] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate, isValidating } = codeFetchHandler(
    fetchState,
    fetchOptions
  )

  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions(fetchState === fetchType.GROUP)

  const isEmptyData = checkDataIsEmpty(data)
  const codesData = data && !isEmptyData ? data : null

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleImportCodes = async (data) => {
    try {
      for (let index = 0; index < data.length; index++) {
        await createCode([data[index]])
      }

      setShowImportModal(false)
      showToast({ message: "Códigos importados correctamente" })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportCodes = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformCodesToExport(codesData))
    download(_data, `codes_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  const handleOpenPopup = (codesToDelete, type) => {
    setDeleteType(type)
    setCodesToDelete(codesToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setCodesToDelete(null)
  }

  const handleOnCloseModal = () => {
    setCodeToUpdate(null)
    setIsCodeModalOpen(false)
  }

  // Handlers CRUD
  const handleDeleteMessage = () => {
    if (!codesToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los códigos seleccionados?"
    const label = getFieldObjectById(codesData, "name", codesToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(codesToDelete, codesData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setCodesToDelete(null)
  }

  const deleteOne = async (id, codes) => {
    try {
      await deleteCode(id)
      showToast({ message: "Código borrado correctamente" })
      return codes.filter((code) => code._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (codesId, codes) => {
    try {
      const codesQueue = codesId.map((id) => deleteCode(id))
      await Promise.all(codesQueue)
      showToast({ message: "Códigos borrados correctamente" })
      return codes.filter((code) => !codesId.includes(code._id))
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const code = codesData.find((code) => code._id === id)
    setCodeToUpdate(code)
    setIsCodeModalOpen(true)
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

  const handleSortElement = (data) => {
    const { name, order } = data

    if (!name || !order) return

    setFetchOptions({
      [fetchOption.ORDER]: `&vtiCode_${name}=${order}`
    })
  }

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
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

      <NewCodeModal
        codeToUpdate={codeToUpdate}
        isOpen={isCodeModalOpen}
        onClose={handleOnCloseModal}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportCodes()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportCodes(data)}
        onDropDataTransform={(info) => codeDataTransform(info)}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden ? (
          <ToolBar
            onAdd={() => setIsCodeModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir código"
            searchPlaceholder="Busqueda por ID, Alias"
            icon={<AddSectorIcon />}
            noFilter
            noGroup
            selectedRows={selectedRows}
          />
        ) : null}
      </PageHeader>
      {isLoading ? (
        <LoadingView mt="-200px" />
      ) : isEmptyData && isSearch ? (
        <ViewNotFoundState noBack />
      ) : isEmptyData && !isValidating ? (
        <ViewEmptyState
          message="Añadir códigos a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir código"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsCodeModalOpen(true)}
        />
      ) : (
        <CodesTable
          codes={codesData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={handleUpdate}
          handleSortElement={handleSortElement}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleRowSelect={handleRowSelect}
          handleSelectAllRows={handleSelectAllRows}
        />
      )}
    </Page>
  )
}

export default codigos
