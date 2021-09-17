import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { Spinner } from "../../components/spinner/Spinner"
import { ToastContext } from "../../provider/ToastProvider"
import { SectorsTable } from "../../views/sectors/SectorsTable/SectorsTable"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { NewSectorModal } from "../../views/sectors/NewSector/NewSectorModal/NewSectorModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import useSectorApi from "../../hooks/api/useSectorApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import {
  DeleteType,
  fetchOption,
  fetchType,
} from "../../utils/constants/global_config"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/common"
import { AddSectorIcon } from "../../components/icons/AddSectorIcon"
import { sectorFetchHandler } from "../../swr/sector.swr"

const sectores = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteSector } = useSectorApi()
  const { showToast } = useContext(ToastContext)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  const { data, error, isLoading, mutate } = sectorFetchHandler(
    fetchState,
    fetchOptions
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false)
  const [sectorToUpdate, setSectorToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [sectorsToDelete, setSectorsToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const sectorsData = data && !isEmptyData ? data : null

  // TODO
  const handleExport = () => {}

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

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(sectorsToDelete, sectorsData)
    setDeleteType(null)
    setSectorsToDelete(null)
  }

  const deleteOne = async (id, sectors) => {
    await deleteSector(id)
    const updatedSectors = sectors.filter((sector) => sector._id !== id)
    await mutate(updatedSectors, false)
    showToast("Sector borrado correctamente")
  }

  const deleteMany = async (sectorsId, sectors) => {
    const sectorsQueue = sectorsId.map((id) => deleteSector(id))
    await Promise.all(sectorsQueue)
    const updatedClients = sectors.filter(
      (sector) => !sectorsId.includes(sector._id)
    )
    await mutate(updatedClients, false)
    showToast("Sectores borrados correctamente")
  }

  const onEdit = (id) => {
    const sector = sectorsData.find((sector) => sector._id === id)
    setSectorToUpdate(sector)
    setIsSectorModalOpen(true)
  }

  const onSearch = (search) => {
    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: search,
    })
  }

  if (error) return <>ERROR...</>
  return !isLoggedIn ? (
    <>Loading...</>
  ) : (
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
        {deleteType === DeleteType.ONE
          ? `¿Desea eliminar ${getFieldObjectById(
              sectorsData,
              "title",
              sectorsToDelete
            )}?`
          : "¿Desea eliminar los sectores seleccionados?"}
      </Popup>

      <NewSectorModal
        sectorToUpdate={sectorToUpdate}
        isOpen={isSectorModalOpen}
        onClose={handleOnCloseModal}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader>
        <BreadCrumbs />
        {sectorsData ? (
          <ToolBar
            onAdd={() => setIsSectorModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir sector"
            searchPlaceholder="Busqueda por ID, Alias"
            icon={<AddSectorIcon />}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <Spinner /> : null}
      {isEmptyData ? (
        <ViewEmptyState
          message="Añadir sectores a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir sector"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsSectorModalOpen(true)}
        />
      ) : null}
      {sectorsData ? (
        <SectorsTable
          sectors={sectorsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default sectores
