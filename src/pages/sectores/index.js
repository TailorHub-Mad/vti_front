import { useContext, useEffect, useState } from "react"
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
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import useFetchSWR from "../../hooks/useFetchSWR"
import { DeleteType } from "../../utils/constants/global_config"
import { pullAt } from "lodash"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"

const sectores = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { getSectors, deleteSector } = useSectorApi()
  const { showToast } = useContext(ToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR(
    SWR_CACHE_KEYS.sectors,
    getSectors
  )

  console.log(data)

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false)
  const [sectorToEdit, setSectorToEdit] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [sectorsToDelete, setSectorsToDelete] = useState(null)

  // Search state
  const [searchChain, setSearchChain] = useState("")
  const [searchedSectors, setSearchedSectors] = useState([])

  const emptyData = Boolean(data && data[0]?.testSectors.length === 0)
  const sectorsData = data ? data[0]?.testSectors : []

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

  const handleOnOpenModal = () => {
    setIsSectorModalOpen(true)
  }

  const handleOnCloseModal = () => {
    setSectorToEdit(null)
    setIsSectorModalOpen(false)
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(sectorsToDelete, sectorsData)
    setDeleteType(null)
    setSectorsToDelete(null)
  }

  const getAliasByIdSector = (id) => {
    const { alias } = sectorsData.find((sector) => sector._id === id)
    return alias
  }

  const deleteOne = async (id, sectors) => {
    await deleteSector(id)
    const updatedSectors = []
    updatedSectors.push({
      testSectors: sectors.filter((sector) => sector._id !== id),
    })
    await mutate(updatedSectors, false)
    showToast("Sistema de ensayo borrado correctamente")
  }

  const deleteMany = async (positions, sectors) => {
    const sectorsQueue = positions.map((position) =>
      deleteSector(sectorsData[position]._id)
    )
    await Promise.all(sectorsQueue)
    pullAt(sectors, positions)
    const updatedSectors = []
    updatedSectors.push({ testSectors: sectors })
    await mutate(updatedSectors, false)
    showToast("Sistemas de ensayo borrados correctamente")
  }

  const onEdit = (id) => {
    const sector = [...sectorsData].find((sector) => sector._id === id)
    setSectorToEdit(sector)
    setIsSectorModalOpen(true)
  }

  const onSearch = (search) => {
    setSearchChain(search)

    if (search === "") return setSearchedSectors([])

    const results = sectorsData.filter(
      (sector) =>
        sector._id.toLowerCase().includes(search.toLowerCase()) ||
        sector.vtiCode.toLowerCase().includes(search.toLowerCase())
    )
    setSearchedSectors(results)
  }

  useEffect(() => {
    if (emptyData || searchChain === "") return
    onSearch(searchChain)
  }, [data])

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
          ? `¿Desea eliminar ${getAliasByIdSector(sectorsToDelete)}?`
          : "¿Desea eliminar los sectores de ensayo seleccionados?"}
      </Popup>

      <NewSectorModal
        sectorToEdit={sectorToEdit}
        isOpen={isSectorModalOpen}
        onClose={handleOnCloseModal}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader>
        <BreadCrumbs />
        {!isLoading && !emptyData && (
          <ToolBar
            onAddTestSystem={handleOnOpenModal}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
          />
        )}
      </PageHeader>
      {isLoading ? <Spinner /> : null}
      {emptyData ? (
        <ViewEmptyState
          message="Añadir sectores a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir sector"
          onImport={() => setShowImportModal(true)}
          onAdd={handleOnOpenModal}
        />
      ) : null}
      {data && !emptyData ? (
        <SectorsTable
          items={searchChain !== "" ? searchedSectors : sectorsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default sectores
