import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useClientApi from "../../hooks/api/useClientApi"
import { ApiToastContext } from "../../provider/ApiToastProvider"
import { SectorsTable } from "../../views/sectors/SectorsTable/SectorsTable"
import { ViewEmptyState } from "../../views/common/NotesEmptyState/ViewEmptyState"
import { MOCK_SECTORS_TABLE } from "../../mock/sectors_table"
import { NewSectorModal } from "../../views/sectors/NewSector/NewSectorModal/NewSectorModal"
import { ImportFilesModal } from "../../views/common/ImportFilesModal/ImportFilesModal"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
const sectores = () => {
  const { getClients, deleteClient } = useClientApi()
  const { showToast } = useContext(ApiToastContext)

  const [isFetching, setIsFetching] = useState(false)

  const [sectors, setSectors] = useState(MOCK_SECTORS_TABLE)
  const [allSectors, setAllSectors] = useState(null)
  const areSectors = sectors && sectors.length > 0

  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const [sectorToEdit, setClientToEdit] = useState(false)
  const [sectorToDelete, setSectorToDelete] = useState(null)

  const onDelete = async (id) => {
    await deleteClient(id)
    setSectorToDelete(null)
    const _sectors = [...sectors].filter((sector) => sector._id !== id)
    setSectors(_sectors)
    showToast("Sectores borrados correctamente")
    //TODO Diferenciar borrado multiple de individual en el popup
  }
  const onEdit = (id) => {
    const [sector] = [...sectors].filter((sector) => sector._id === id)
    setClientToEdit(sector)
    setIsSectorModalOpen(true)
  }

  const handleExport = () => {}

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
      await getClients()
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

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader title="Sectores">
        {areSectors && !isFetching ? (
          <ToolBar
            onAddSector={() => setIsSectorModalOpen(true)}
            onSearch={handleSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
          />
        ) : null}
      </PageHeader>
      {isFetching ? <LoadingTableSpinner /> : null}
      {!areSectors && !isFetching ? (
        <ViewEmptyState
          message="Añadir sectores a la platorma"
          importButtonText="Importar"
          addButtonText="Añadir sector"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsSectorModalOpen(true)}
        />
      ) : null}
      {areSectors && !isFetching ? (
        <SectorsTable
          sectors={sectors}
          onDelete={(id) => setSectorToDelete(id)}
          onEdit={onEdit}
          deleteItems={() => {}}
        />
      ) : null}
    </Page>
  )
}

export default sectores
