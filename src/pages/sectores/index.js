import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { ToastContext } from "../../provider/ToastProvider"
import { SectorsTable } from "../../views/sectors/SectorsTable/SectorsTable"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { NewSectorModal } from "../../views/sectors/NewSector/NewSectorModal/NewSectorModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import useSectorApi from "../../hooks/api/useSectorApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { DeleteType } from "../../utils/constants/global"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { AddSectorIcon } from "../../components/icons/AddSectorIcon"
import { sectorFetchHandler } from "../../swr/sector.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"
import {
  sectorDataTransform,
  transformSectorsToExport
} from "../../utils/functions/import_export/sectors_helper"
import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"
import useTableActions from "../../hooks/useTableActions"

const sectores = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteSector, createSector } = useSectorApi()
  const { showToast } = useContext(ToastContext)

  // States
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false)
  const [sectorToUpdate, setSectorToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [sectorsToDelete, setSectorsToDelete] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate, isValidating } = sectorFetchHandler(
    fetchState,
    fetchOptions
  )

  const isEmptyData = checkDataIsEmpty(data)
  const sectorsData = data && !isEmptyData ? data : null

  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions(fetchState === fetchType.GROUP)

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleImportSectors = async (data) => {
    for (let index = 0; index < data.length; index++) {
      const sector = await createSector([data[index]])
      if (sector.error) {
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
    showToast({ message: "Sectores importados correctamente" })
  }

  const handleExportSectors = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformSectorsToExport(sectorsData))
    download(_data, `sectores_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  const handleOpenPopup = (sectorsToDelete, type) => {
    setDeleteType(type)
    setSectorsToDelete(sectorsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setSectorsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setSectorToUpdate(null)
    setIsSectorModalOpen(false)
  }

  // Handlers CRUD
  const handleDeleteMessage = () => {
    if (!sectorsToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los sectores seleccionados?"
    const label = getFieldObjectById(sectorsData, "title", sectorsToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(sectorsToDelete, sectorsData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setSectorsToDelete(null)
  }

  const deleteOne = async (id, sectors) => {
    try {
      await deleteSector(id)
      showToast({ message: "Sector borrado correctamente" })
      return sectors.filter((sector) => sector._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (sectorsId, sectors) => {
    try {
      const sectorsQueue = sectorsId.map((id) => deleteSector(id))
      await Promise.all(sectorsQueue)
      showToast({ message: "Sectores borrados correctamente" })
      return sectors.filter((sector) => !sectorsId.includes(sector._id))
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const sector = sectorsData.find((sector) => sector._id === id)
    setSectorToUpdate(sector)
    setIsSectorModalOpen(true)
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
      [fetchOption.ORDER]: `&sector_${name}=${order}`
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

      <NewSectorModal
        sectorToUpdate={sectorToUpdate}
        isOpen={isSectorModalOpen}
        onClose={handleOnCloseModal}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportSectors()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportSectors(data)}
        onDropDataTransform={(info) => sectorDataTransform(info)}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden ? (
          <ToolBar
            onAdd={() => setIsSectorModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir sector"
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
          message="Añadir sectores a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir sector"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsSectorModalOpen(true)}
        />
      ) : (
        <SectorsTable
          sectors={sectorsData}
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

export default sectores
