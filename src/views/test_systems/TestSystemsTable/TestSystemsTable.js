import { Checkbox, Flex, Text } from "@chakra-ui/react"
import { Table } from "../../../components/tables/Table/Table"
import { TableOptionsMenu } from "../../../components/tables/TableOptionsMenu/TableOptionsMenu"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"

export const TestSystemsTable = ({ items, ...props }) => {
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()

  const test_systems_table = {
    components: {
      text: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      notes: <TagGroup variant="testSystem" max={4} />,
      projects: <TagGroup variant="project" max={3} />,
      options: <TableOptionsMenu />,
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
        <Flex justify="space-between" align="center" pb="32px">
          <Checkbox />
          <Text variant="d_s_medium" color="grey">
            {`${items?.length || 0} sistemas`}
          </Text>
        </Flex>
      }
      config={test_systems_table}
      content={items}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight="calc(100vh - 190px)"
      p="32px"
      pb="0"
      {...props}
    />
  )
}
