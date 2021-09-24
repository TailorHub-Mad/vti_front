import React, { useMemo, useState } from "react"
import { Table } from "../../../components/tables/Table/Table"
import useTableActions from "../../../hooks/useTableActions"
import { fetchType } from "../../../utils/constants/swr"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { ProjectsTableHeader } from "./ProjectsTableHeader"
import { formatProject, TABLE_PROJECTS_HEAD } from "./utils"

export const ProjectsTable = ({
  projects,
  onTabChange,
  onDelete,
  onDeleteMany,
  onEdit,
  fetchState
}) => {
  const { selectedRows, setSelectedRows, handleSelectAllRows, handleRowSelect } =
    useTableActions()

  const selectedRowsKeys = Object.keys(selectedRows)

  const [activeItem, setActiveItem] = useState(fetchType.ALL)

  useMemo(() => {
    setSelectedRows([])
  }, [projects?.length])

  const handleOnTabChange = (state) => {
    setActiveItem(state)
    onTabChange(state)
  }

  const handleOnDelete = () => {
    const projectsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(projectsId)
    return onDelete(projectsId[0])
  }

  const projectsData = formatProject(projects, fetchState)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_PROJECTS_HEAD,
      options: { ...TABLE_PROJECTS_HEAD.options, onDelete, onEdit }
    }
  }
  const allRowsAreSelected = selectedRowsKeys.length === projectsData?.length

  return (
    <Table
      header={
        <ProjectsTableHeader
          activeItem={activeItem}
          onChange={handleOnTabChange}
          projectsCount={projectsData?.length}
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(projectsData)}
          checked={allRowsAreSelected}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={projectsData}
      selectedRows={selectedRows}
      onRowSelect={(id) => handleRowSelect(id)}
      optionsDisabled={selectedRowsKeys.length > 1}
      isGrouped={fetchState === fetchType.GROUP}
    />
  )
}
