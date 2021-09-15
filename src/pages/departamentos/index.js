import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Popup } from "../../components/overlay/Popup/Popup"
import { Spinner } from "../../components/spinner/Spinner"
import useDepartmentApi from "../../hooks/api/useDepartmentApi"
import { ToastContext } from "../../provider/ToastProvider"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { DepartmentsTable } from "../../views/departments/DepartmentsTable/DepartmentsTable"
import { NewDepartmentModal } from "../../views/departments/NewDepartment/NewDepartmentModal/NewDepartmentModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import useFetchSWR from "../../hooks/useFetchSWR"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { DeleteType } from "../../utils/constants/global_config"
import { pullAt } from "lodash"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { AddDepartmentIcon } from "../../components/icons/AddDepartmentIcon"

const departamentos = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { getDepartments, deleteDepartment } = useDepartmentApi()
  const { showToast } = useContext(ToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR(
    SWR_CACHE_KEYS.departments,
    getDepartments
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)
  const [departmentToUpdate, setDepartmentToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [departmentsToDelete, setDepartmentsToDelete] = useState(null)

  // Search state
  const [searchChain, setSearchChain] = useState("")
  const [searchedDepartments, setSearchedDepartments] = useState([])

  const isEmptyData = Boolean(data && data.length === 0)
  const departmentsData = data ?? []

  // TODO
  const handleExport = () => {}

  const handleOpenPopup = (departmentsToDelete, type) => {
    setDeleteType(type)
    setDepartmentsToDelete(departmentsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setDepartmentsToDelete(null)
  }

  const handleOnOpenModal = () => {
    setIsDepartmentModalOpen(true)
  }

  const handleOnCloseModal = () => {
    setDepartmentToUpdate(null)
    setIsDepartmentModalOpen(false)
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(departmentsToDelete, departmentsData)
    setDeleteType(null)
    setDepartmentsToDelete(null)
  }

  const getAliasByIdDepartment = (id) => {
    const { alias } = departmentsData.find((department) => department.id === id)
    return alias
  }

  const deleteOne = async (id, departments) => {
    await deleteDepartment(id)
    const updatedDepartments = []
    updatedDepartments.push({
      testDepartments: departments.filter((department) => department.id !== id),
    })
    await mutate(updatedDepartments, false)
    showToast("Departmento borrado correctamente")
  }

  const deleteMany = async (positions, departments) => {
    const departmentsQueue = positions.map((position) =>
      deleteDepartment(departmentsData[position].id)
    )
    await Promise.all(departmentsQueue)
    pullAt(departments, positions)
    const updatedDepartments = []
    updatedDepartments.push({ testDepartments: departments })
    await mutate(updatedDepartments, false)
    showToast("Departmentos borrados correctamente")
  }

  const onEdit = (id) => {
    const department = [...departmentsData].find(
      (department) => department.id === id
    )
    setDepartmentToUpdate(department)
    setIsDepartmentModalOpen(true)
  }

  const onSearch = (search) => {
    setSearchChain(search)

    if (search === "") return setSearchedDepartments([])

    const results = departmentsData.filter(
      (department) =>
        department.id.toLowerCase().includes(search.toLowerCase()) ||
        department.vtiCode.toLowerCase().includes(search.toLowerCase())
    )
    setSearchedDepartments(results)
  }

  useEffect(() => {
    if (isEmptyData || searchChain === "") return
    onSearch(searchChain)
  }, [data])

  if (error) return <>ERROR...</>
  if (!data || !isLoggedIn) return <>Loading...</>
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
        {deleteType === DeleteType.ONE
          ? `¿Desea eliminar ${getAliasByIdDepartment(departmentsToDelete)}?`
          : "¿Desea eliminar los departamentos seleccionados?"}
      </Popup>

      <NewDepartmentModal
        departmentToUpdate={departmentToUpdate}
        isOpen={isDepartmentModalOpen}
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
            addLabel="Añadir departamento"
            searchPlaceholder="Busqueda por ID, Alias"
            icon={<AddDepartmentIcon />}
          />
        )}
      </PageHeader>
      {isLoading ? <Spinner /> : null}
      {isEmptyData ? (
        <ViewEmptyState
          message="Añadir departamentos a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir departamento"
          onImport={() => setShowImportModal(true)}
          onAdd={handleOnOpenModal}
        />
      ) : null}
      {data && !isEmptyData ? (
        <DepartmentsTable
          items={searchChain !== "" ? searchedDepartments : departmentsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default departamentos
