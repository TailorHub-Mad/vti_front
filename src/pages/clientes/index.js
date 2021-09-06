import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useClientsApi from "../../hooks/api/useClientsApi"
import { ApiToastContext } from "../../provider/ApiToastProvider"
import { ClientsTable } from "../../views/clients/ClientsTable/ClientsTable"
import { ClientsToolBar } from "../../views/clients/ClientsToolBar/ClientsToolBar"
import { NewClientModal } from "../../views/clients/ClientsToolBar/NewClient/NewClientModal/NewClientModal"
import { ViewEmptyState } from "../../views/common/NotesEmptyState/ViewEmptyState"

const clientes = () => {
  const [isFetching, setIsFetching] = useState(false)
  //TODO Fetch de la lista de proyectos, gestion de la carga y pasarlo a la tabla por props
  const { getClients, deleteClient } = useClientsApi()
  const [clients, setClients] = useState(null)
  const [allClients, setAllClients] = useState(null)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [clientToEdit, setClientToEdit] = useState(false)
  const { showToast } = useContext(ApiToastContext)
  const areClients = clients && clients.length > 0
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
      <PageHeader title="Clientes">
        {areClients && !isFetching ? (
          <ClientsToolBar onAddClient={() => setIsClientModalOpen(true)} onSearch={handleSearch} />
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