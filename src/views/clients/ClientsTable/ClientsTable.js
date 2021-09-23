import { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatClient, TABLE_CLIENT_HEAD } from "./utils"

export const ClientsTable = ({ clients = [], onDelete, onEdit, onDeleteMany }) => {
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()

  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [clients.length])

  const handleOnDelete = () => {
    if (selectedRowsKeys.length > 1) return onDeleteMany(selectedRowsKeys)
    return onDelete(selectedRowsKeys[0])
  }

  const clientsData = formatClient(clients)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_CLIENT_HEAD,
      options: { ...TABLE_CLIENT_HEAD.options, onDelete, onEdit }
    }
  }

  const allRowsAreSelected = selectedRowsKeys.length === clientsData?.length

  return (
    <Table
      header={
        <TableHeader
          count={clientsData?.length}
          countLabel="Clientes"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(clientsData)}
          checked={allRowsAreSelected}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={clientsData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
    />
  )
}
