import { Checkbox, Flex, Text } from "@chakra-ui/react"
import { Table } from "../../../components/tables/Table/Table"
import { TableOptionsMenu } from "../../../components/tables/TableOptionsMenu/TableOptionsMenu"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { MOCK_TEST_SYSTEM_TABLE } from "../../../mock/test_system_table"

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
        width: calcColWidth(50),
        type: "text",
      },
      projects: {
        label: "Proyectos",
        width: calcColWidth(260),
        type: "tagGroup",
      },
      notes: {
        label: "Apuntes",
        width: calcColWidth(360),
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
      content={MOCK_TEST_SYSTEM_TABLE}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      p="32px"
      {...props}
    />
  )
}
