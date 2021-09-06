import { Checkbox, Text } from "@chakra-ui/react"
import { useMemo, useState } from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { TestSystemTableHeader } from "../TestSystemsTableHeader/TestSystemTableHeader"
import { TestSystemsRowOptionMenu } from "./TestSystemsRowOptionMenu/TestSystemsRowOptionMenu"

export const TestSystemsTable = ({
  items,
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
  }, [items.length])

  const handleSelectAllRows = (e) => {
    const value = e.target.checked ? [...Array(items.length).keys()] : []
    setSelectedRows(value)
  }

  const handleOnDelete = () => {
    if (selectedRows.length > 1) return onDeleteMany(selectedRows)
    return onDelete(items[selectedRows[0]]._id)
  }

  const content = items?.map((item) => {
    return {
      actions: "",
      id: item._id,
      alias: "MedVelo-ADDITIUM--007", //TODO -> API pending
      client: item.clientAlias,
      code: item.vtiCode,
      year: item.date.year,
      projects: item.projects, //TODO -> DB pending
      notes: item.notes,
      options: "",
    }
  })

  const test_systems_table = {
    components: {
      text: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      notes: <TagGroup variant="testSystem" max={4} />,
      projects: <TagGroup variant="project" max={3} />,
      options: <TestSystemsRowOptionMenu onDelete={onDelete} onEdit={onEdit} />,
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
        type: "text",
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
          testSystemsCount={content?.length}
          activeItem={activeItem}
          onChange={(value) => setActiveItem(value)}
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={handleSelectAllRows}
        />
      }
      config={test_systems_table}
      content={content}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight="calc(100vh - 190px)"
      p="32px"
      pb="0"
      {...props}
    />
  )
}
