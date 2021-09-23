import { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatUser, TABLE_USERS_HEAD } from "./utils"

export const UsersTable = ({ users = [], onDelete, onEdit, onDeleteMany }) => {
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()

  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [users.length])

  const handleOnDelete = () => {
    if (selectedRowsKeys.length > 1) return onDeleteMany(selectedRowsKeys)
    return onDelete(selectedRowsKeys[0])
  }

  const usersData = formatUser(users)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_USERS_HEAD,
      options: { ...TABLE_USERS_HEAD.options, onDelete, onEdit }
    }
  }

  const allRowsAreSelected = selectedRowsKeys.length === usersData?.length

  return (
    <Table
      header={
        <TableHeader
          count={usersData?.length}
          countLabel="Usuarios"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(usersData)}
          checked={allRowsAreSelected}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={usersData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      optionsDisabled={selectedRowsKeys.length > 1}
    />
  )
}
