import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { Spinner } from "../../components/spinner/Spinner"
import useDepartmentApi from "../../hooks/api/useDepartmentApi"
import { ApiToastContext } from "../../provider/ToastProvider"
import { ViewEmptyState } from "../../views/common/NotesEmptyState/ViewEmptyState"
import { MOCK_DEPARTMENTS_TABLE } from "../../mock/departments_table"
import { DepartmentsTable } from "../../views/departments/DepartmentsTable/DepartmentsTable"
import { NewDepartmentModal } from "../../views/departments/NewDepartment/NewDepartmentModal/NewDepartmentModal"
import { ImportFilesModal } from "../../views/common/ImportFilesModal/ImportFilesModal"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
const departamentos = () => {
  const { showToast } = useContext(ApiToastContext)
  const { getDepartments, deleteDepartment } = useDepartmentApi()

  const [isFetching, setIsFetching] = useState(false)

  const [allDepartments, setAllDepartments] = useState(null)
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS_TABLE)
  const areDepartments = departments && departments.length > 0

  const [departmentToEdit, setDepartmentToEdit] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState(null)

  const [showImportModal, setShowImportModal] = useState(false)
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)

  const onDelete = async (id) => {
    await deleteDepartment(id)
    setDepartmentToDelete(null)
    const _departments = [...departments].filter(
      (department) => department._id !== id
    )
    setDepartments(_departments)
    showToast("Departamentos borrados correctamente")
    //TODO Diferenciar borrado multiple de individual en el popup
  }

  const onEdit = (id) => {
    const [department] = [...departments].filter(
      (department) => department._id === id
    )
    setDepartmentToEdit(department)
    setIsDepartmentModalOpen(true)
  }

  const handleExport = () => {}

  const handleSearch = (val) => {
    const results = allDepartments.filter(
      (cl) =>
        cl.alias.toLowerCase().includes(val.toLowerCase()) ||
        cl.name.toLowerCase().includes(val.toLowerCase())
    )
    setDepartments(results)
  }

  useEffect(() => {
    setIsFetching(true)
    const fetchClients = async () => {
      await getDepartments()
      setDepartments(MOCK_DEPARTMENTS_TABLE)
      setAllDepartments([])
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
        isOpen={departmentToDelete}
        onConfirm={() => onDelete(departmentToDelete)}
        onClose={() => setDepartmentToDelete(null)}
      >
        {`Desea eliminar ${departmentToDelete}`}
      </Popup>

      <NewDepartmentModal
        departmentToEdit={departmentToEdit}
        isOpen={isDepartmentModalOpen}
        onClose={() => {
          setIsDepartmentModalOpen(false)
          setDepartmentToEdit(null)
        }}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
      <PageHeader title="Departamentos">
        {areDepartments && !isFetching ? (
          <ToolBar
            onAddDepartment={() => setIsDepartmentModalOpen(true)}
            onSearch={handleSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
          />
        ) : null}
      </PageHeader>
      {isFetching ? <Spinner /> : null}
      {!areDepartments && !isFetching ? (
        <ViewEmptyState
          message="Añadir departmentes a la platorma"
          importButtonText="Importar"
          addButtonText="Añadir department"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsDepartmentModalOpen(true)}
        />
      ) : null}
      {areDepartments && !isFetching ? (
        <DepartmentsTable
          departments={departments}
          onDelete={(id) => setDepartmentToDelete(id)}
          onEdit={onEdit}
          deleteItems={() => {}}
        />
      ) : null}
    </Page>
  )
}

export default departamentos
