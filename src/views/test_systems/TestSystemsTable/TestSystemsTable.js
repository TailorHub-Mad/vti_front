import { useContext, useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global"
import { fetchType } from "../../../utils/constants/swr"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatSystem, TABLE_SYSTEMS_HEAD, TABLE_SYSTEMS_HEAD_USER } from "./utils"

export const TestSystemsTable = ({
  systems,
  onDelete,
  onEdit,
  onDeleteMany,
  fetchState,
  onGroup,
  onSubscribe,
  onFilter,
  groupOption,
  handleSortElement,
  onFavorite,
  selectedRows,
  setSelectedRows,
  handleRowSelect,
  handleSelectAllRows
}) => {
  const { role } = useContext(ApiAuthContext)

  const isGrouped = fetchState === fetchType.GROUP

  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [systems?.length])

  const handleOnDelete = () => {
    const systemsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(systemsId)

    return isGrouped ? onDelete(selectedRows) : onDelete(systemsId[0])
  }

  const systemsHead =
    role === RoleType.ADMIN ? TABLE_SYSTEMS_HEAD : TABLE_SYSTEMS_HEAD_USER

  const systemsData = formatSystem(systems, fetchState)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...systemsHead,
      options: {
        ...systemsHead.options,
        onDelete,
        onEdit,
        onSubscribe,
        isGrouped,
        onFavorite
      }
    }
  }

  const allRowsAreSelected =
    systemsData?.length > 0 && selectedRowsKeys.length === systemsData?.length

  return (
    <Table
      header={
        <TableHeader
          count={systemsData?.length}
          countLabel="Sistemas de ensayo"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(systemsData)}
          checked={allRowsAreSelected}
          fetchState={fetchState}
          onGroup={onGroup}
          onFilter={onFilter}
          groupOption={groupOption}
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={systemsData}
      selectedRows={selectedRows}
      onRowSelect={handleRowSelect}
      optionsDisabled={selectedRowsKeys.length > 1}
      isGrouped={fetchState === fetchType.GROUP}
      handleSortElement={handleSortElement}
    />
  )
}
