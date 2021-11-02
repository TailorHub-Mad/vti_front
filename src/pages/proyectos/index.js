import { useContext, useState } from "react"
import useProjectApi from "../../hooks/api/useProjectApi"
import { ProjectsTable } from "../../views/projects/ProjectTable/ProjectTable"
import { Popup } from "../../components/overlay/Popup/Popup"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { NewProjectModal } from "../../views/projects/NewProject/NewProjectModal/NewProjectModal"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { ToastContext } from "../../provider/ToastProvider"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { DeleteType, RoleType } from "../../utils/constants/global"
import { projectFetchHandler } from "../../swr/project.swr"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { AddProjectIcon } from "../../components/icons/AddProjectIcon"
import {
  checkDataIsEmpty,
  getFieldGRoupObjectById,
  getFieldObjectById
} from "../../utils/functions/global"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { getGroupOptionLabel } from "../../utils/functions/objects"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"

import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import {
  projectDataTransform,
  transformProjectsToExport
} from "../../utils/functions/import_export/projects_helper"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"
import { FinishProjectModal } from "../../views/projects/NewProject/FinishProjectModal/FinishProjectModal"
import { generateFilterQuery } from "../../utils/functions/filter"
import { ProjectsFilterModal } from "../../views/projects/ProjectFilter/ProjectsFilterModal"
import { PROJECTS_FILTER_KEYS } from "../../utils/constants/filter"
import { ProjectsMenu } from "../../views/projects/ProjectsMenu/ProjectsMenu"
import useUserApi from "../../hooks/api/useUserApi"
import { remove } from "lodash"
import useTableActions from "../../hooks/useTableActions"
import { PageBody } from "../../components/layout/Pages/PageBody/PageBody"

const PROJECTS_GROUP_OPTIONS = [
  {
    label: "Cliente",
    value: "clientAlias"
  },
  {
    label: "Año",
    value: "date.year"
  },
  {
    label: "Sector",
    value: "sector.0.title"
  }
]

const proyectos = () => {
  // Hooks
  const { isLoggedIn, role, user } = useContext(ApiAuthContext)
  const { deleteProject, createProject } = useProjectApi()
  const { showToast } = useContext(ToastContext)
  const { updateUser } = useUserApi()

  const isAdmin = role === RoleType.ADMIN

  // States
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [queryFilter, setQueryFilter] = useState(null)
  const [queryGroup, setQueryGroup] = useState(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToUpdate, setProjectToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [projectsToDelete, setProjectsToDelete] = useState(null)
  const [projectToFinish, setProjectToFinish] = useState(null)
  const [isFinishProjectModalOpen, setIsFinishProjectModalOpen] = useState(null)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  // Fetch
  const { data, error, isLoading, mutate, isValidating } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleProjectsData = (isEmptyData) => {
    if (!data || isEmptyData) return []
    if (fetchState == fetchType.GROUP) return data
    return data[0].projects
  }

  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = handleProjectsData(isEmptyData)

  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions(fetchState === fetchType.GROUP)

  const isGrouped = fetchState == fetchType.GROUP

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const isMenuHidden = () => {
    if (isLoading) return false
    if (fetchState === fetchType.GROUP) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const handleImportProjects = async (data) => {
    try {
      for (let index = 0; index < data.length; index++) {
        await createProject(data[index])
      }

      await mutate()

      setShowImportModal(false)
      showToast({ message: "Proyectos importados correctamente" })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportProjects = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformProjectsToExport(projectsData))
    download(_data, `projects_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  // Handlers views
  const handleOpenPopup = (projectsToDelete, type) => {
    setDeleteType(type)

    if (type === DeleteType.ONE && isGrouped) {
      const [id, { key }] = Object.entries(projectsToDelete)[0]
      return setProjectsToDelete({ id, key })
    }
    return setProjectsToDelete(projectsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setProjectsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setProjectToUpdate(null)
    setIsProjectModalOpen(false)
  }

  const handleOnOpenFinishProjectModal = async (data) => {
    if (isGrouped) {
      const [id, { key }] = Object.entries(data)[0]
      const project = projectsData[key].find((p) => (p._id = id))
      setProjectToFinish(project)
    } else {
      const project = projectsData.find((p) => (p._id = data))
      setProjectToFinish(project)
    }

    setIsFinishProjectModalOpen(true)
  }

  const handleOnCloseFinishProjectModal = () => {
    setProjectToFinish(null)
    setIsFinishProjectModalOpen(null)
  }

  const handleOnOpenFilter = () => {
    if (fetchState === fetchType.FILTER || queryFilter) handleOnFilter(null)
    else setShowFilterModal(true)
  }

  // Handlers CRUD
  const handleDeleteMessage = () => {
    if (!projectsToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los proyectos seleccionados?"

    const label = isGrouped
      ? getFieldGRoupObjectById(
          projectsData,
          "alias",
          projectsToDelete.id,
          projectsToDelete.key
        )
      : getFieldObjectById(projectsData, "alias", projectsToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(projectsToDelete, projectsData)

    setDeleteType(null)
    setProjectsToDelete(null)
    if (isGrouped || updated?.length === 0) return await mutate()
    await mutate(updated, false)
  }

  const deleteOne = async (data, projects) => {
    try {
      if (isGrouped) {
        await deleteProject(data.id)
        showToast({ message: "Proyecto borrado correctamente" })
        return
      }

      await deleteProject(data)
      showToast({ message: "Proyecto borrado correctamente" })
      const updatedProjects = []
      const filterProjects = projects.filter((system) => system._id !== data)
      updatedProjects.push({
        projects: filterProjects
      })
      return updatedProjects
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (projectsId, projects) => {
    try {
      const projectsQueue = projectsId.map((id) => deleteProject(id))
      await Promise.all(projectsQueue)
      showToast({ message: "Proyectos borrados correctamente" })
      const updatedProjects = []
      const filterProjects = projects.filter(
        (project) => !projectsId.includes(project._id)
      )
      updatedProjects.push({ projects: filterProjects })
      return updatedProjects
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (data) => {
    if (isGrouped) {
      const [id, { key }] = Object.entries(data)[0]
      const project = projectsData[key].find((project) => project._id === id)
      setProjectToUpdate(project)
    } else {
      const project = projectsData.find((project) => project._id === data)
      setProjectToUpdate(project)
    }

    setIsProjectModalOpen(true)
  }

  const formatUpdateUsersSubscribe = (user, subscribed) => {
    return {
      alias: user.alias,
      name: user.name,
      subscribed,
      department: user.department
    }
  }

  const formatUpdateUsersFavorites = (user, favorites) => {
    return {
      alias: user.alias,
      name: user.name,
      favorites,
      department: user.department
    }
  }

  const handleSubscribe = async (data, state) => {
    const { subscribed, _id } = user

    const listToUpdate = subscribed["projects"]

    if (isGrouped) {
      const [id] = Object.entries(data)[0]
      if (state) {
        remove(listToUpdate, (e) => e === id)
      } else {
        listToUpdate.push(id)
      }
    } else {
      if (state) {
        remove(listToUpdate, (e) => e === data)
      } else {
        listToUpdate.push(data)
      }
    }

    subscribed["projects"] = listToUpdate

    const formatUser = formatUpdateUsersSubscribe(user, subscribed)
    await updateUser(_id, formatUser)
    await mutate()
  }

  const handleFavorite = async (data, state) => {
    const { favorites, _id } = user

    const listToUpdate = favorites["projects"]

    if (isGrouped) {
      const [id] = Object.entries(data)[0]
      if (state) {
        remove(listToUpdate, (e) => e === id)
      } else {
        listToUpdate.push(id)
      }
    } else {
      if (state) {
        remove(listToUpdate, (e) => e === data)
      } else {
        listToUpdate.push(data)
      }
    }
    favorites["projects"] = listToUpdate
    const formatUser = formatUpdateUsersFavorites(user, favorites)
    await updateUser(_id, formatUser)
    await mutate()
  }

  // Filters
  const onSearch = (search) => {
    if (queryFilter) setQueryFilter(null)
    if (queryGroup) setQueryGroup(null)

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

  // const handleOnGroup = (group) => {
  //   if (!group) {
  //     setFetchState(fetchType.ALL)
  //     setFetchOptions({
  //       [fetchOption.GROUP]: null
  //     })
  //     return
  //   }

  //   setFetchState(fetchType.GROUP)
  //   setFetchOptions({
  //     [fetchOption.GROUP]: group
  //   })
  // }

  const handleOnGroup = (group) => {
    if (!group) {
      setQueryGroup(null)
      if (queryFilter) {
        setFetchState(fetchType.FILTER)
        setFetchOptions({
          [fetchOption.FILTER]: queryFilter
        })
        return
      } else {
        setFetchState(fetchType.ALL)
        setFetchOptions({
          [fetchOption.GROUP]: null
        })
        return
      }
    }

    setQueryGroup(group)

    if (fetchState === fetchType.FILTER) {
      const newGroup = `${group}&${queryFilter}`
      setFetchState(fetchType.GROUP)
      setFetchOptions({
        [fetchOption.GROUP]: newGroup
      })
    } else {
      setFetchState(fetchType.GROUP)

      setFetchOptions({
        [fetchOption.GROUP]: group
      })
    }
  }

  // const handleOnFilter = (values) => {
  //   if (!values) {
  //     setFetchState(fetchType.ALL)
  //     setFetchOptions({
  //       [fetchOption.FILTER]: null
  //     })
  //     return
  //   }

  //   const filter = generateFilterQuery(PROJECTS_FILTER_KEYS, values)

  //   setFetchState(fetchType.FILTER)
  //   setFetchOptions({
  //     [fetchOption.FILTER]: filter
  //   })

  //   setShowFilterModal(false)
  // }

  const handleSortElement = (data) => {
    const { name, order } = data
    if (!name || !order) return

    setFetchOptions({
      ...fetchOptions,
      [fetchOption.ORDER]: `&projects_${name}=${order}`
    })
  }

  const handleOnFilter = (values, type) => {
    if (!values) {
      setQueryFilter(null)

      if (queryGroup) {
        setFetchState(fetchType.GROUP)
        setFetchOptions({
          [fetchOption.GROUP]: queryGroup
        })
        return
      } else {
        setFetchState(fetchType.ALL)

        setFetchOptions({
          [fetchOption.FILTER]: null
        })
        return
      }
    }

    let filter = null
    if (type !== "complex") {
      filter = generateFilterQuery(PROJECTS_FILTER_KEYS, values)
    } else {
      filter = `query=${values}`
    }

    setQueryFilter(filter)

    if (fetchState === fetchType.GROUP) {
      const newGroup = `${queryGroup}&${filter}`
      setFetchState(fetchType.GROUP)
      setFetchOptions({
        [fetchOption.GROUP]: newGroup
      })
    } else {
      setFetchState(fetchType.FILTER)
      setFetchOptions({
        [fetchOption.FILTER]: filter
      })
    }

    setShowFilterModal(false)
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
      <ProjectsFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values, type) => handleOnFilter(values, type)}
      />
      <NewProjectModal
        projectToUpdate={projectToUpdate}
        isOpen={isProjectModalOpen}
        onClose={handleOnCloseModal}
      />
      <FinishProjectModal
        project={projectToFinish}
        isOpen={isFinishProjectModalOpen}
        onClose={handleOnCloseFinishProjectModal}
        isGrouped={isGrouped}
      />
      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportProjects()}
      />
      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportProjects(data)}
        onDropDataTransform={(info) => projectDataTransform(info)}
      />
      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden() ? (
          <ToolBar
            onAdd={() => setIsProjectModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onFilter={handleOnOpenFilter}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir proyecto"
            searchPlaceholder="Busqueda por ID, Alias"
            groupOptions={PROJECTS_GROUP_OPTIONS}
            icon={<AddProjectIcon />}
            fetchState={fetchState}
            noAdd={!isAdmin}
            noImport={!isAdmin}
            selectedRows={selectedRows}
            queryFilter={queryFilter}
            queryGroup={queryGroup}
          />
        ) : null}
      </PageHeader>

      <PageBody overflow="hidden">
        {isMenuHidden() ? (
          <ProjectsMenu
            fetchState={fetchState}
            onChange={(state) => setFetchState(state)}
          />
        ) : null}

        {isLoading ? (
          <LoadingView mt="-200px" />
        ) : isEmptyData && fetchState !== fetchType.ALL ? (
          <ViewNotFoundState noBack />
        ) : isEmptyData && !isValidating ? (
          <ViewEmptyState
            message="Añadir proyectos a la plataforma"
            importButtonText="Importar"
            addButtonText="Añadir proyecto"
            onImport={() => setShowImportModal(true)}
            onAdd={() => setIsProjectModalOpen(true)}
          />
        ) : (
          <ProjectsTable
            fetchState={fetchState}
            projects={projectsData}
            onClose={handleOnOpenFinishProjectModal}
            onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
            onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
            onEdit={handleUpdate}
            onGroup={handleOnGroup}
            onFilter={handleOnFilter}
            groupOption={getGroupOptionLabel(
              PROJECTS_GROUP_OPTIONS,
              fetchOptions[fetchOption.GROUP]
            )}
            handleSortElement={handleSortElement}
            onSubscribe={handleSubscribe}
            onFavorite={handleFavorite}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            handleRowSelect={handleRowSelect}
            handleSelectAllRows={handleSelectAllRows}
          />
        )}
      </PageBody>
    </Page>
  )
}

export default proyectos
