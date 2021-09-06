import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { Popup } from "../../components/overlay/Popup/Popup"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useClientApi from "../../hooks/api/useClientApi"
import { ApiToastContext } from "../../provider/ApiToastProvider"
import { ClientsTable } from "../../views/clients/ClientsTable/ClientsTable"
import { ClientsToolBar } from "../../views/clients/ClientsToolBar/ClientsToolBar"
import { NewClientModal } from "../../views/clients/ClientsToolBar/NewClient/NewClientModal/NewClientModal"
import { ViewEmptyState } from "../../views/common/NotesEmptyState/ViewEmptyState"

const clientes = () => {
  const { getClients, deleteClient } = useClientApi()
  const { showToast } = useContext(ApiToastContext)

  const [isFetching, setIsFetching] = useState(false)

  const [clients, setClients] = useState(null)
  const [allClients, setAllClients] = useState(null)
  const areClients = clients && clients.length > 0

  const [isClientModalOpen, setIsClientModalOpen] = useState(false)

  const [clientToEdit, setClientToEdit] = useState(null)
  const [clientToDelete, setClientToDelete] = useState(null)

  const onDelete = async (id) => {
    await deleteClient(id)
    setClientToDelete(null)
    const _clients = [...clients].filter((client) => client._id !== id)
    setClients(_clients)
    showToast("Clientes borrados correctamente")
    //TODO Diferenciar borrado multiple de individual en el popup
  }

  const onEdit = (id) => {
    const [client] = [...clients].filter((client) => client._id === id)
    setClientToEdit(client)
    setIsClientModalOpen(true)
  }

  const handleImport = () => {
    console.log("Import clients")
  }

  const handleSearch = (val) => {
    const results = allClients.filter(
      (cl) =>
        cl.alias.toLowerCase().includes(val.toLowerCase()) ||
        cl.name.toLowerCase().includes(val.toLowerCase())
    )
    setClients(results)
  }

  useEffect(() => {
    setIsFetching(true)
    const fetchClients = async () => {
      const _clients = await getClients()
      setClients(_clients)
      setAllClients(_clients)
      setIsFetching(false)
    }
    fetchClients()
  }, [])

  return (
    <Page>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={clientToDelete}
        onConfirm={() => onDelete(clientToDelete)}
        onClose={() => setClientToDelete(null)}
      >
        {`Desea eliminar ${clientToDelete}`}
      </Popup>

      <NewClientModal
        clientToEdit={clientToEdit}
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false)
          setClientToEdit(null)
        }}
      />
      <PageHeader>
        <BreadCrumbs />
        {areClients && !isFetching ? (
          <ClientsToolBar
            onAddClient={() => setIsClientModalOpen(true)}
            onSearch={handleSearch}
          />
        ) : null}
      </PageHeader>
      {isFetching ? <LoadingTableSpinner /> : null}
      {!areClients && !isFetching ? (
        <ViewEmptyState
          message="Añadir clientes a la platorma"
          importButtonText="Importar"
          addButtonText="Añadir cliente"
          onImport={handleImport}
          onAdd={() => setIsClientModalOpen(true)}
        />
      ) : null}
      {areClients && !isFetching ? (
        <ClientsTable
          clients={clients}
          onDelete={(id) => setClientToDelete(id)}
          onEdit={onEdit}
          deleteItems={(rows) => console.log("borra", rows)}
        />
      ) : null}
    </Page>
  )
}

export default clientes
