import React, { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { TABLE_COMPONENTS } from "../../../utils/constants/tables"
import { formatSector, TABLE_SECTORS_HEAD } from "./utils"

export const SectorsTable = ({ sectors, onDelete, onEdit, onDeleteMany }) => {
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [sectors.length])

  const handleOnDelete = () => {
    const sectorsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(sectorsId)
    return onDelete(sectorsId[0])
  }

  const sectorsData = formatSector(sectors)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_SECTORS_HEAD,
      options: { ...TABLE_SECTORS_HEAD.options, onDelete, onEdit }
    }
  }

  return (
    <Table
      header={
        <TableHeader
          count={sectorsData?.length}
          countLabel="Sectores"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(sectorsData)}
          checked={Object.keys(selectedRows).length === sectorsData?.length}
        />
      }
      config={configTable}
      content={sectorsData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      p="32px"
      pb="0"
      tableHeight={"calc(100vh - 190px)"}
    />
  )
}
