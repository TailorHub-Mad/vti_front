import { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { TABLE_COMPONENTS } from "../../../utils/constants/tables"
import { formatClient, TABLE_CLIENT_HEAD } from "./utils"

export const ClientsTable = ({ clients = [], onDelete, onEdit, onDeleteMany }) => {
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [clients.length])

  const handleOnDelete = () => {
    const clientsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(clientsId)
    return onDelete(clientsId[0])
  }

  const clientsData = formatClient(clients)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_CLIENT_HEAD,
      options: { ...TABLE_CLIENT_HEAD.options, onDelete, onEdit }
    }
  }

  return (
    <Table
      header={
        <TableHeader
          count={clientsData?.length}
          countLabel="Clientes"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(clientsData)}
          checked={Object.keys(selectedRows).length === clientsData?.length}
        />
      }
      config={configTable}
      content={clientsData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight={"calc(100vh - 190px)"}
      p="32px"
      pb="0"
    />
  )
}
