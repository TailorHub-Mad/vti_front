import { useMemo } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import useTableActions from "../../../hooks/useTableActions"
import { TABLE_COMPONENTS } from "../../../utils/constants/tables"
import { formatSystem, TABLE_SYSTEMS_HEAD } from "./utils"

export const TestSystemsTable = ({ systems, onDelete, onEdit, onDeleteMany }) => {
  const { selectedRows, setSelectedRows, handleSelectAllRows, handleRowSelect } =
    useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [systems.length])

  const handleOnDelete = () => {
    const systemsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(systemsId)
    return onDelete(systemsId[0])
  }

  const systemsData = formatSystem(systems)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: {
      ...TABLE_SYSTEMS_HEAD,
      options: { ...TABLE_SYSTEMS_HEAD.options, onDelete, onEdit }
    }
  }

  return (
    <Table
      header={
        <TableHeader
          count={systemsData?.length}
          countLabel="Sistemas de ensayo"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(systemsData)}
          checked={Object.keys(selectedRows).length === systemsData?.length}
        />
      }
      config={configTable}
      content={systemsData}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight="calc(100vh - 190px)"
      p="32px"
      pb="0"
    />
  )
}
