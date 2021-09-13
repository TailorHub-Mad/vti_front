import { Checkbox, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"

export const TestSystemsTable = ({
  items: systems,
  onDelete,
  onEdit,
  onDeleteMany,
}) => {
  const { selectedRows, setSelectedRows, handleRowSelect, calcColWidth } =
    useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [systems.length])

  const handleSelectAllRows = (e) => {
    const value = e.target.checked ? [...Array(systems.length).keys()] : []
    setSelectedRows(value)
  }

  const handleOnDelete = () => {
    if (selectedRows.length > 1) return onDeleteMany(selectedRows)
    return onDelete(systems[selectedRows[0]].id)
  }

  const _systems = systems?.map((system) => {
    return {
      actions: "",
      id: system.id,
      alias: { label: system.alias, link: `/sistemas/${system.id}` },
      client: system.clientAlias,
      code: system.vtiCode,
      year: system.date.year,
      projects: system.projects,
      notes: system.notes,
      options: "",
    }
  })

  const test_systems_table = {
    components: {
      text: <Text />,
      link: <LinkItem />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      notes: <TagGroup variant="testSystem" max={4} />,
      projects: <TagGroup variant="project" max={3} />,
      options: <OptionsMenuRow onDelete={onDelete} onEdit={onEdit} />,
    },
    head: {
      actions: {
        label: "",
        width: calcColWidth(32),
        type: "selector",
      },
      id: {
        label: "ID",
        width: calcColWidth(88),
        type: "text",
      },
      alias: {
        label: "Alias",
        width: calcColWidth(88),
        type: "link",
      },
      client: {
        label: "Cliente",
        width: calcColWidth(80),
        type: "text",
      },
      code: {
        label: "Código",
        width: calcColWidth(75),
        type: "text",
      },
      year: {
        label: "Año",
        width: calcColWidth(45),
        type: "text",
      },
      projects: {
        label: "Proyectos",
        width: calcColWidth(260),
        type: "tagGroup",
      },
      notes: {
        label: "Apuntes",
        width: calcColWidth(350),
        type: "tagGroup",
      },
      options: {
        label: "",
        width: calcColWidth(20),
        type: "component",
      },
    },
  }
  return (
    <Table
      header={
        <TableHeader
          count={_systems?.length}
          countLabel="Sistemas de ensayo"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={handleSelectAllRows}
        />
      }
      config={test_systems_table}
      content={_systems}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight="calc(100vh - 190px)"
      p="32px"
      pb="0"
    />
  )
}
