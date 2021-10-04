import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../components/overlay/Popup/Popup"
import useClientApi from "../../hooks/api/useClientApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { DeleteType } from "../../utils/constants/global"
import { ClientsTable } from "../../views/clients/ClientsTable/ClientsTable"
import { NewClientModal } from "../../views/clients/NewClient/NewClientModal/NewClientModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { AddClientIcon } from "../../components/icons/AddClientIcon"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { clientFetchHandler } from "../../swr/client.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import {
  clientDataTransform,
  transformClientsToExport
} from "../../utils/functions/import_export/clients_helpers"
import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"

const clientes = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteClient } = useClientApi()
  const { showToast } = useContext(ToastContext)
  const { createClient } = useClientApi()
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  const { data, error, isLoading, mutate } = clientFetchHandler(
    fetchState,
    fetchOptions
  )

  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  // Create - Update state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [clientToUpdate, setClientToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [clientsToDelete, setClientsToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const clientsData = data && !isEmptyData ? data : null

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleImportClients = async (data) => {
    //TODO Gestión de errores y update de SWR
    try {
      await createClient(data)
      setShowImportModal(false)
      showToast("Clientes importados correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportClients = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformClientsToExport(clientsData))
    download(_data, `clients_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  const handleOpenPopup = (clientsToDelete, type) => {
    setDeleteType(type)
    setClientsToDelete(clientsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setClientsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setClientToUpdate(null)
    setIsClientModalOpen(false)
  }

  const handleDeleteMessage = () => {
    if (!clientsToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los clientes seleccionados?"
    const label = getFieldObjectById(clientsData, "alias", clientsToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(clientsToDelete, clientsData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setClientsToDelete(null)
  }

  const deleteOne = async (id, clients) => {
    try {
      await deleteClient(id)
      showToast("Cliente borrado correctamente")
      return clients.filter((client) => client._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (clientsId, clients) => {
    try {
      const clientsQueue = clientsId.map((id) => deleteClient(id))
      await Promise.all(clientsQueue)
      showToast("Clientes borrados correctamente")
      return clients.filter((client) => !clientsId.includes(client._id))
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const client = clientsData.find((client) => client._id === id)
    setClientToUpdate(client)
    setIsClientModalOpen(true)
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

      <NewClientModal
        clientToUpdate={clientToUpdate}
        isOpen={isClientModalOpen}
        onClose={handleOnCloseModal}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportClients()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportClients(data)}
        onDropDataTransform={(info) => clientDataTransform(info)}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden() ? (
          <ToolBar
            onAdd={() => setIsClientModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir cliente"
            searchPlaceholder="Busqueda por ID, Alias"
            noFilter
            noGroup
            icon={<AddClientIcon />}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {isEmptyData && isSearch ? (
        <ViewNotFoundState />
      ) : isEmptyData ? (
        <ViewEmptyState
          message="Añadir clientes a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir cliente"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsClientModalOpen(true)}
        />
      ) : null}
      {clientsData ? (
        <ClientsTable
          clients={clientsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(clientsId) => handleOpenPopup(clientsId, DeleteType.MANY)}
          onEdit={handleUpdate}
        />
      ) : null}
    </Page>
  )
}

export default clientes
