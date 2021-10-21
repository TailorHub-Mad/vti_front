import React, { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatDepartment, TABLE_DEPARTMENT_HEAD } from "./utils"

export const DepartmentsTable = ({
  departments,
  onDelete,
  onEdit,
  onDeleteMany,
  handleSortElement,
  selectedRows,
  setSelectedRows,
  handleRowSelect,
  handleSelectAllRows
}) => {
  const selectedRowsKeys = selectedRows && Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows && setSelectedRows([])
  }, [departments?.length])

  const handleOnDelete = () => {
    if (selectedRowsKeys.length > 1) return onDeleteMany(selectedRowsKeys)
    return onDelete(selectedRowsKeys[0])
  }

  const departmentsData = formatDepartment(departments)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_DEPARTMENT_HEAD,
      options: { ...TABLE_DEPARTMENT_HEAD.options, onDelete, onEdit }
    }
  }

  const allRowsAreSelected =
    departmentsData?.length > 0 &&
    selectedRowsKeys?.length === departmentsData?.length

  return (
    <Table
      header={
        <TableHeader
          count={departmentsData?.length}
          countLabel="Departamentos"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(departmentsData)}
          checked={allRowsAreSelected}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={departmentsData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      optionsDisabled={selectedRowsKeys?.length > 1}
      handleSortElement={handleSortElement}
    />
  )
}
