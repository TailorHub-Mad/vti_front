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
import useTableActions from "../../hooks/useTableActions"

const clientes = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteClient, createClient } = useClientApi()
  const { showToast } = useContext(ToastContext)

  // States
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [clientToUpdate, setClientToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [clientsToDelete, setClientsToDelete] = useState(null)

  // fetch
  const { data, error, isLoading, mutate, isValidating } = clientFetchHandler(
    fetchState,
    fetchOptions
  )

  const isEmptyData = checkDataIsEmpty(data)
  const clientsData = data && !isEmptyData ? data : []

  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions(fetchState === fetchType.GROUP)

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
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

  // Handlers CRUD
  const handleImportClients = async (data) => {
    for (let index = 0; index < data.length; index++) {
      const client = await createClient([data[index]])
      if (client.error) {
        showToast({
          message: `Ha habido un error en la fila ${
            index + 2
          }. La importación se ha cancelado a partir de esta fila.`,
          time: 5000
        })
        return
      }
    }
    await mutate()
    setShowImportModal(false)
    showToast({ message: "Clientes importados correctamente" })
  }

  const handleExportClients = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformClientsToExport(clientsData))
    download(_data, `clients_export_${new Date().toLocaleDateString()}`, "text/csv")
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
    if (updated) {
      updated.length > 0 ? await mutate(updated, false) : await mutate()
    }
    setDeleteType(null)
    setClientsToDelete(null)
  }

  const deleteOne = async (id, clients) => {
    try {
      await deleteClient(id)
      showToast({ message: "Cliente borrado correctamente" })
      return clients.filter((client) => client._id !== id)
    } catch (error) {
      showToast({
        message:
          "El cliente no puede ser borrado. Tiene sistemas de ensayo asociados."
      })
      errorHandler(error)
    }
  }

  const deleteMany = async (clientsId, clients) => {
    try {
      const clientsQueue = clientsId.map((id) => deleteClient(id))
      const errors = []
      const results = await Promise.allSettled(clientsQueue)
      results.forEach((result) => {
        if (result.status === "rejected") {
          errors.push(result.reason)
        }
      })
      if (errors.length > 0) {
        const clientsNotDelete = errors.map((error) => {
          return error.config.url.split("/clients/")[1]
        })
        clientsId = clientsId.filter((id) => !clientsNotDelete.includes(id))
        showToast({
          message:
            "Alguno de los clientos tiene sistema de ensayo y no se han eliminado."
        })
      } else {
        showToast({ message: "Clientes borrados correctamente" })
      }
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

  const handleSortElement = (data) => {
    const { name, order } = data

    if (!name || !order) return

    setFetchOptions({
      [fetchOption.ORDER]: `&_${name}=${order}`
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
            selectedRows={selectedRows}
          />
        ) : null}
      </PageHeader>
      {isLoading ? (
        <LoadingView mt="-200px" />
      ) : isEmptyData && isSearch ? (
        <ViewNotFoundState />
      ) : isEmptyData && !isValidating ? (
        <ViewEmptyState
          message="Añadir clientes a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir cliente"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsClientModalOpen(true)}
        />
      ) : (
        <ClientsTable
          clients={clientsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(clientsId) => handleOpenPopup(clientsId, DeleteType.MANY)}
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

export default clientes
