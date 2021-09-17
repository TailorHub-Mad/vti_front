import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../components/overlay/Popup/Popup"
import { Spinner } from "../../components/spinner/Spinner"
import useClientApi from "../../hooks/api/useClientApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import {
  DeleteType,
  fetchOption,
  fetchType,
} from "../../utils/constants/global_config"
import { ClientsTable } from "../../views/clients/ClientsTable/ClientsTable"
import { NewClientModal } from "../../views/clients/NewClient/NewClientModal/NewClientModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { AddClientIcon } from "../../components/icons/AddClientIcon"
import { checkDataIsEmpty } from "../../utils/functions/common"
import { clientFetchHandler } from "../../swr/client.swr"

const clientes = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteClient } = useClientApi()
  const { showToast } = useContext(ToastContext)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  const { data, error, isLoading, mutate } = clientFetchHandler(
    fetchState,
    fetchOptions
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [clientToUpdate, setClientToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [clientsToDelete, setClientsToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const clientsData = data && !isEmptyData ? data : null

  // TODO
  const handleExport = () => {}

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

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(clientsToDelete, clientsData)
    setDeleteType(null)
    setClientsToDelete(null)
  }

  const getAliasByIdClient = (id) => {
    const client = clientsData?.find((client) => client._id === id)
    return client?.alias
  }

  const deleteOne = async (id, clients) => {
    await deleteClient(id)
    const updatedClients = clients.filter((client) => client._id !== id)
    await mutate(updatedClients, false)
    showToast("Cliente borrado correctamente")
  }

  const deleteMany = async (clientsId, clients) => {
    const clientsQueue = clientsId.map((id) => deleteClient(id))
    await Promise.all(clientsQueue)
    const updatedClients = clients.filter(
      (client) => !clientsId.includes(client._id)
    )
    await mutate(updatedClients, false)
    showToast("Clientes borrados correctamente")
  }

  const onEdit = (id) => {
    const client = clientsData.find((client) => client._id === id)
    setClientToUpdate(client)
    setIsClientModalOpen(true)
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
          ? `¿Desea eliminar ${getAliasByIdClient(clientsToDelete)}?`
          : "¿Desea eliminar los clientes seleccionados?"}
      </Popup>

      <NewClientModal
        clientToUpdate={clientToUpdate}
        isOpen={isClientModalOpen}
        onClose={handleOnCloseModal}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader>
        <BreadCrumbs />
        {clientsData ? (
          <ToolBar
            onAdd={() => setIsClientModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir cliente"
            searchPlaceholder="Busqueda por ID, Alias"
            withoutFilter
            withoutGroup
            icon={<AddClientIcon />}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <Spinner /> : null}
      {isEmptyData ? (
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
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default clientes
