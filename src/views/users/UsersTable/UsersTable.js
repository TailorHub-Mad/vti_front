import { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { fetchType } from "../../../utils/constants/swr"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatUser, TABLE_USERS_HEAD } from "./utils"

export const UsersTable = ({
  users = [],
  onDelete,
  onClose,
  onDeleteMany,
  onEdit,
  fetchState,
  onGroup,
  onFilter,
  groupOption,
  handleSortElement
}) => {
  const isGrouped = fetchState === fetchType.GROUP

  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions(isGrouped)

  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [users?.length])

  const handleOnDelete = () => {
    if (selectedRowsKeys.length > 1) return onDeleteMany(selectedRowsKeys)
    return onDelete(selectedRowsKeys[0])
  }

  const usersData = formatUser(users, fetchState)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_USERS_HEAD,
      options: { ...TABLE_USERS_HEAD.options, onDelete, onEdit, onClose, isGrouped }
    }
  }

  const allRowsAreSelected =
    usersData?.length > 0 && selectedRowsKeys.length === usersData?.length

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
          onGroup={onGroup}
          onFilter={onFilter}
          groupOption={groupOption}
          fetchState={fetchState}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={usersData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      optionsDisabled={selectedRowsKeys.length > 1}
      isGrouped={fetchState === fetchType.GROUP}
      handleSortElement={handleSortElement}
    />
  )
}
