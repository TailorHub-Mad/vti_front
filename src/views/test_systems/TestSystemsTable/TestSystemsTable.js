import { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { fetchType } from "../../../utils/constants/swr"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatSystem, TABLE_SYSTEMS_HEAD } from "./utils"

export const TestSystemsTable = ({
  systems,
  onDelete,
  onEdit,
  onDeleteMany,
  fetchState,
  onGroup,
  onFilter,
  groupOption
}) => {
  const isGrouped = fetchState === fetchType.GROUP

  const { selectedRows, setSelectedRows, handleSelectAllRows, handleRowSelect } =
    useTableActions(isGrouped)

  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [systems.length])

  const handleOnDelete = () => {
    const systemsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(systemsId)

    return isGrouped ? onDelete(selectedRows) : onDelete(systemsId[0])
  }

  const systemsData = formatSystem(systems, fetchState)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_SYSTEMS_HEAD,
      options: { ...TABLE_SYSTEMS_HEAD.options, onDelete, onEdit, isGrouped }
    }
  }

  const allRowsAreSelected = selectedRowsKeys.length === systemsData?.length

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
    />
  )
}
