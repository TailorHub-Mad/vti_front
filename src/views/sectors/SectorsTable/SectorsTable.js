import React, { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatSector, TABLE_SECTORS_HEAD } from "./utils"

export const SectorsTable = ({
  sectors,
  onDelete,
  onEdit,
  onDeleteMany,
  handleSortElement
}) => {
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()

  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [sectors?.length])

  const handleOnDelete = () => {
    if (selectedRowsKeys.length > 1) return onDeleteMany(selectedRowsKeys)
    return onDelete(selectedRowsKeys[0])
  }

  const sectorsData = formatSector(sectors)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_SECTORS_HEAD,
      options: { ...TABLE_SECTORS_HEAD.options, onDelete, onEdit }
    }
  }

  const allRowsAreSelected =
    sectorsData?.length > 0 && selectedRowsKeys.length === sectorsData?.length

  return (
    <Table
      header={
        <TableHeader
          count={sectorsData?.length}
          countLabel="Sectores"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(sectorsData)}
          checked={allRowsAreSelected}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={sectorsData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      optionsDisabled={selectedRowsKeys.length > 1}
      handleSortElement={handleSortElement}
    />
  )
}
