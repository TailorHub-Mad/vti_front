import { pullAt } from "lodash"
import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../components/overlay/Popup/Popup"
import { Spinner } from "../../components/spinner/Spinner"
import useClientApi from "../../hooks/api/useClientApi"
import useFetchSWR from "../../hooks/useFetchSWR"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { DeleteType } from "../../utils/constants/global_config"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { ClientsTable } from "../../views/clients/ClientsTable/ClientsTable"
import { NewClientModal } from "../../views/clients/NewClient/NewClientModal/NewClientModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { AddClientIcon } from "../../components/icons/AddClientIcon"

const clientes = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { getClients, deleteClient } = useClientApi()
  const { showToast } = useContext(ToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR(
    SWR_CACHE_KEYS.clients,
    getClients
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [clientToUpdate, setClientToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [clientsToDelete, setClientsToDelete] = useState(null)

  // Search state
  const [searchChain, setSearchChain] = useState("")
  const [searchedClients, setSearchedClients] = useState([])

  const isEmptyData = Boolean(data && data.length === 0)
  const clientsData = data ?? []

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

  const handleOnOpenModal = () => {
    setIsClientModalOpen(true)
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
    const { alias } = clientsData.find((client) => client._id === id)
    return alias
  }

  const deleteOne = async (id, clients) => {
    await deleteClient(id)
    const updatedClients = clients.filter((client) => client._id !== id)
    await mutate(updatedClients, false)
    showToast("Cliente borrado correctamente")
  }

  const deleteMany = async (positions, clients) => {
    const clientsQueue = positions.map((position) =>
      deleteClient(clientsData[position]._id)
    )
    await Promise.all(clientsQueue)
    pullAt(clients, positions)
    const updatedClients = [...clients]
    await mutate(updatedClients, false)
    showToast("Clientes borrados correctamente")
  }

  const onEdit = (id) => {
    const client = [...clientsData].find((client) => client._id === id)
    setClientToUpdate(client)
    setIsClientModalOpen(true)
  }

  const onSearch = (search) => {
    setSearchChain(search)

    if (search === "") return setSearchedClients([])

    const results = clientsData.filter(
      (client) =>
        client._id.toLowerCase().includes(search.toLowerCase()) ||
        client.vtiCode.toLowerCase().includes(search.toLowerCase())
    )
    setSearchedClients(results)
  }

  useEffect(() => {
    if (isEmptyData || searchChain === "") return
    onSearch(searchChain)
  }, [clientsData])

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
        {!isLoading && !isEmptyData && (
          <ToolBar
            onAdd={handleOnOpenModal}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir cliente"
            searchPlaceholder="Busqueda por ID, Alias"
            withoutFilter
            withoutGroup
            icon={<AddClientIcon />}
          />
        )}
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
      {clientsData && !isEmptyData ? (
        <ClientsTable
          clients={searchChain !== "" ? searchedClients : clientsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default clientes
