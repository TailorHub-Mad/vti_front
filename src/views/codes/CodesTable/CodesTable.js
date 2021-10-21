import React, { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatCode, TABLE_CODES_HEAD } from "./utils"

export const CodesTable = ({
  codes,
  onDelete,
  onEdit,
  onDeleteMany,
  handleSortElement,
  selectedRows,
  setSelectedRows,
  handleRowSelect,
  handleSelectAllRows
}) => {
  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [codes?.length])

  const handleOnDelete = () => {
    if (selectedRowsKeys.length > 1) return onDeleteMany(selectedRowsKeys)
    return onDelete(selectedRowsKeys[0])
  }

  const codesData = formatCode(codes)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_CODES_HEAD,
      options: { ...TABLE_CODES_HEAD.options, onDelete, onEdit }
    }
  }

  const allRowsAreSelected =
    codesData?.length > 0 && selectedRowsKeys.length === codesData?.length

  return (
    <Table
      header={
        <TableHeader
          count={codesData?.length}
          countLabel="Códigos"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(codesData)}
          checked={allRowsAreSelected}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={codesData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      optionsDisabled={selectedRowsKeys.length > 1}
      handleSortElement={handleSortElement}
    />
  )
}
