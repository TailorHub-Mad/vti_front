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
  fetchState
}) => {
  const { selectedRows, setSelectedRows, handleSelectAllRows, handleRowSelect } =
    useTableActions()

  const selectedRowsKeys = Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows([])
  }, [systems.length])

  const handleOnDelete = () => {
    if (selectedRowsKeys.length > 1) return onDeleteMany(selectedRowsKeys)
    return onDelete(selectedRowsKeys[0])
  }

  const systemsData = formatSystem(systems, fetchState)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_SYSTEMS_HEAD,
      options: { ...TABLE_SYSTEMS_HEAD.options, onDelete, onEdit }
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
        />
      }
      {...TABLE_STYLE}
      config={configTable}
      content={systemsData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      optionsDisabled={selectedRowsKeys.length > 1}
      isGrouped={fetchState === fetchType.GROUP}
    />
  )
}
