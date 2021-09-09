import { Checkbox, Text } from "@chakra-ui/react"
import { useMemo, useState } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { RowOptionMenu } from "../../../components/navigation/RowOptionMenu/RowOptionMenu"
import { Table } from "../../../components/tables/Table/Table"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { TestSystemTableHeader } from "../TestSystemsTableHeader/TestSystemTableHeader"

export const TestSystemsTable = ({
  items: systems,
  onDelete,
  onEdit,
  onDeleteMany,
  ...props
}) => {
  const { selectedRows, setSelectedRows, handleRowSelect, calcColWidth } =
    useTableActions()
  const [activeItem, setActiveItem] = useState("all")

  useMemo(() => {
    setSelectedRows([])
  }, [systems.length])

  const handleSelectAllRows = (e) => {
    const value = e.target.checked ? [...Array(systems.length).keys()] : []
    setSelectedRows(value)
  }

  const handleOnDelete = () => {
    if (selectedRows.length > 1) return onDeleteMany(selectedRows)
    return onDelete(systems[selectedRows[0]]._id)
  }

  const _systems = systems?.map((system) => {
    return {
      actions: "",
      id: system._id,
      alias: { label: system.alias, link: `/sistemas/${system._id}` },
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
      options: <RowOptionMenu onDelete={onDelete} onEdit={onEdit} />,
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
        <TestSystemTableHeader
          testSystemsCount={_systems?.length}
          activeItem={activeItem}
          onChange={(value) => setActiveItem(value)}
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
      {...props}
    />
  )
}
