import React, { useContext, useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global"
import { fetchType } from "../../../utils/constants/swr"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { ProjectsTableHeader } from "./ProjectsTableHeader"
import {
  formatProject,
  TABLE_PROJECTS_HEAD,
  TABLE_PROJECTS_HEAD_USER
} from "./utils"

export const ProjectsTable = ({
  projects,
  onDelete,
  onClose,
  onDeleteMany,
  onEdit,
  fetchState = fetchType.ALL,
  onGroup,
  onFilter,
  groupOption,
  handleSortElement,
  onSubscribe,
  onFavorite,
  selectedRows,
  setSelectedRows,
  handleRowSelect,
  handleSelectAllRows
}) => {
  const { role } = useContext(ApiAuthContext)

  const isGrouped = fetchState === fetchType.GROUP

  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [projects?.length])

  const handleOnDelete = () => {
    const projectsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(projectsId)

    return isGrouped ? onDelete(selectedRows) : onDelete(projectsId[0])
  }

  const projectsHead =
    role === RoleType.ADMIN ? TABLE_PROJECTS_HEAD : TABLE_PROJECTS_HEAD_USER

  const projectsData = formatProject(projects, fetchState)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...projectsHead,
      options: {
        ...projectsHead.options,
        onDelete,
        onEdit,
        onClose,
        isGrouped,
        onSubscribe,
        onFavorite
      }
    }
  }
  const allRowsAreSelected =
    projectsData?.length > 0 && selectedRowsKeys.length === projectsData?.length

  return (
    <Table
      header={
        <ProjectsTableHeader
          projectsCount={projectsData?.length}
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(projectsData)}
          checked={allRowsAreSelected}
          fetchState={fetchState}
          onGroup={onGroup}
          onFilter={onFilter}
          groupOption={groupOption}
          role={role}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={projectsData}
      selectedRows={selectedRows}
      onRowSelect={handleRowSelect}
      optionsDisabled={selectedRowsKeys.length > 1}
      isGrouped={isGrouped}
      handleSortElement={handleSortElement}
    />
  )
}
