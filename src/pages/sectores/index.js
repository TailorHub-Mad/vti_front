import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useClientsApi from "../../hooks/api/useClientsApi"
import { ApiToastContext } from "../../provider/ApiToastProvider"
import { SectorsTable } from "../../views/sectors/SectorsTable/SectorsTable"
import { ViewEmptyState } from "../../views/common/NotesEmptyState/ViewEmptyState"
import { MOCK_SECTORS_TABLE } from "../../mock/sectors_table"
import { SectorsToolBar } from "../../views/sectors/SectorsToolBar/SectorsToolBar"
import {NewSectorModal} from "../../views/sectors/SectorsToolBar/NewSectorModal/NewSectorModal"
const sectores = () => {
  const [isFetching, setIsFetching] = useState(false)
  //TODO Fetch de la lista de proyectos, gestion de la carga y pasarlo a la tabla por props
  const { getClients, deleteClient } = useClientsApi()
  const [sectors, setSectors] = useState(MOCK_SECTORS_TABLE)
  const [allSectors, setAllSectors] = useState(null)
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false)
  const [sectorToEdit, setClientToEdit] = useState(false)
  const { showToast } = useContext(ApiToastContext)
  const areClients = sectors && sectors.length > 0
  const [sectorToDelete, setSectorToDelete] = useState(null)
  const onDelete = async (id) => {
    await deleteClient(id)
    setSectorToDelete(null)
    const _sectors = [...sectors].filter((sector) => sector._id !== id)
    setSectors(_sectors)
    showToast("Clientes borrados correctamente")
    //TODO Diferenciar borrado multiple de individual en el popup
  }
  const onEdit = (id) => {
    const [sector] = [...sectors].filter((sector) => sector._id === id)
    setClientToEdit(sector)
    setIsSectorModalOpen(true)
  }

  const handleImport = () => {
    console.log("Import sectors")
  }

  const handleSearch = (val) => {
    const results = allSectors.filter(
      (cl) =>
        cl.alias.toLowerCase().includes(val.toLowerCase()) ||
        cl.name.toLowerCase().includes(val.toLowerCase())
    )
    setSectors(results)
  }

  useEffect(() => {
    setIsFetching(true)
    const fetchClients = async () => {
      const _sectors = await getClients()
      console.log(_sectors)
      setSectors(MOCK_SECTORS_TABLE)
      setAllSectors([])
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
        isOpen={sectorToDelete}
        onConfirm={() => onDelete(sectorToDelete)}
        onClose={() => setSectorToDelete(null)}
      >
        {`Desea eliminar ${sectorToDelete}`}
      </Popup>

      <NewSectorModal
        sectorToEdit={sectorToEdit}
        isOpen={isSectorModalOpen}
        onClose={() => {
          setIsSectorModalOpen(false)
          setClientToEdit(null)
        }}
      />
      <PageHeader title="Sectores">
        {areClients && !isFetching ? (
          <SectorsToolBar onAddSector={() => setIsSectorModalOpen(true)} onSearch={handleSearch} />
        ) : null}
      </PageHeader>
      {isFetching ? <LoadingTableSpinner /> : null}
      {!areClients && !isFetching ? (
        <ViewEmptyState
          message="Añadir sectores a la platorma"
          importButtonText="Importar"
          addButtonText="Añadir sector"
          onImport={handleImport}
          onAdd={() => setIsSectorModalOpen(true)}
        />
      ) : null}
      {areClients && !isFetching ? (
        <SectorsTable
          sectors={sectors}
          onDelete={(id) => setSectorToDelete(id)}
          onEdit={onEdit}
          deleteItems={(rows) => console.log("borra", rows)}
        />
      ) : null}
    </Page>
  )
}

export default sectores
