import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { ToastContext } from "../../provider/ToastProvider"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { DepartmentsTable } from "../../views/departments/DepartmentsTable/DepartmentsTable"
import { NewDepartmentModal } from "../../views/departments/NewDepartment/NewDepartmentModal/NewDepartmentModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { DeleteType } from "../../utils/constants/global"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { AddDepartmentIcon } from "../../components/icons/AddDepartmentIcon"
import { departmentFetchHandler } from "../../swr/department.swr"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import useDepartmentApi from "../../hooks/api/useDepartmentApi"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"
import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import {
  departmentDataTransform,
  transformDepartmentsToExport
} from "../../utils/functions/import_export/departments_helpers.js"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"

const departamentos = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteDepartment, createDepartment } = useDepartmentApi()
  const { showToast } = useContext(ToastContext)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  const { data, error, isLoading, mutate } = departmentFetchHandler(
    fetchState,
    fetchOptions
  )

  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  // Create - Update state
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)
  const [departmentToUpdate, setDepartmentToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [departmentsToDelete, setDepartmentsToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const departmentsData = data && !isEmptyData ? data : null

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleOpenPopup = (departmentsToDelete, type) => {
    setDeleteType(type)
    setDepartmentsToDelete(departmentsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setDepartmentsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setDepartmentToUpdate(null)
    setIsDepartmentModalOpen(false)
  }

  // Handle CRUD
  const handleImportSectors = async (data) => {
    //TODO Gestión de errores y update de SWR

    try {
      for (let index = 0; index < data.length; index++) {
        await createDepartment(data[index])
      }

      setShowImportModal(false)
      showToast("Departamentos importados correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportSectors = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformDepartmentsToExport(departmentsData))
    download(
      _data,
      `departamentos_export_${new Date().toLocaleDateString()}`,
      "text/csv"
    )
  }

  const handleDeleteMessage = () => {
    if (!departmentsToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los departamentos seleccionados?"
    const label = getFieldObjectById(departmentsData, "name", departmentsToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(departmentsToDelete, departmentsData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setDepartmentsToDelete(null)
  }

  const deleteOne = async (id, departments) => {
    try {
      await deleteDepartment(id)
      showToast("Departamento borrado correctamente")
      return departments.filter((department) => department._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (departmentsId, departments) => {
    try {
      const departmentsQueue = departmentsId.map((id) => deleteDepartment(id))
      await Promise.all(departmentsQueue)
      showToast("Departamentos borrados correctamente")
      return departments.filter(
        (department) => !departmentsId.includes(department._id)
      )
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const department = departmentsData.find((department) => department._id === id)
    setDepartmentToUpdate(department)
    setIsDepartmentModalOpen(true)
  }

  // Filters
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
      [fetchOption.ORDER]: `&projects_${name}=${order}`
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

      <NewDepartmentModal
        departmentToUpdate={departmentToUpdate}
        isOpen={isDepartmentModalOpen}
        onClose={handleOnCloseModal}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportSectors()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportSectors(data)}
        onDropDataTransform={(info) => departmentDataTransform(info)}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden() ? (
          <ToolBar
            onAdd={() => setIsDepartmentModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir departamentos"
            searchPlaceholder="Busqueda por ID, Alias"
            icon={<AddDepartmentIcon />}
            noFilter
            noGroup
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {isEmptyData && isSearch ? (
        <ViewNotFoundState />
      ) : isEmptyData ? (
        <ViewEmptyState
          message="Añadir departamentos a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir departamentos"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsDepartmentModalOpen(true)}
        />
      ) : null}
      {departmentsData ? (
        <DepartmentsTable
          departments={departmentsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(departmentsId) =>
            handleOpenPopup(departmentsId, DeleteType.MANY)
          }
          onEdit={handleUpdate}
          handleSortElement={handleSortElement}
        />
      ) : null}
    </Page>
  )
}

export default departamentos
