import { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { TABLE_COMPONENTS } from "../../../utils/constants/tables"
import { formatUser, TABLE_USERS_HEAD } from "./utils"

export const UsersTable = ({ users = [], onDelete, onEdit, onDeleteMany }) => {
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [users.length])

  const handleOnDelete = () => {
    const usersId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(usersId)
    return onDelete(usersId[0])
  }

  const usersData = formatUser(users)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_USERS_HEAD,
      options: { ...TABLE_USERS_HEAD.options, onDelete, onEdit }
    }
  }

  return (
    <Table
      header={
        <TableHeader
          count={usersData?.length}
          countLabel="Usuarios"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(usersData)}
          checked={Object.keys(selectedRows).length === usersData?.length}
        />
      }
      config={configTable}
      content={usersData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight={"calc(100vh - 190px)"}
      p="32px"
      pb="0"
    />
  )
}
