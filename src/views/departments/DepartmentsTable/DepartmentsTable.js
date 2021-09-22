import React, { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { TABLE_COMPONENTS } from "../../../utils/constants/tables"
import { formatDepartment, TABLE_DEPARTMENT_HEAD } from "./utils"

export const DepartmentsTable = ({
  departments,
  onDelete,
  onEdit,
  onDeleteMany
}) => {
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [departments.length])

  const handleOnDelete = () => {
    const departmentsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(departmentsId)
    return onDelete(departmentsId[0])
  }

  const departmentsData = formatDepartment(departments)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_DEPARTMENT_HEAD,
      options: { ...TABLE_DEPARTMENT_HEAD.options, onDelete, onEdit }
    }
  }

  return (
    <Table
      header={
        <TableHeader
          count={departmentsData?.length}
          countLabel="Departamentos"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(departmentsData)}
          checked={Object.keys(selectedRows).length === departmentsData?.length}
        />
      }
      config={configTable}
      content={departmentsData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      p="32px"
      pb="0"
      tableHeight={"calc(100vh - 190px)"}
    />
  )
}
