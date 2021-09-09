import { Checkbox, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { RowOptionMenu } from "../../../components/navigation/RowOptionMenu/RowOptionMenu"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"

export const ClientsTable = ({ clients, onDelete, onEdit, onDeleteMany }) => {
  const { selectedRows, setSelectedRows, handleRowSelect, calcColWidth } =
    useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [clients.length])

  const handleSelectAllRows = (e) => {
    const value = e.target.checked ? [...Array(clients.length).keys()] : []
    setSelectedRows(value)
  }

  const handleOnDelete = () => {
    if (selectedRows.length > 1) return onDeleteMany(selectedRows)
    return onDelete(clients[selectedRows[0]]._id)
  }

  const _clients =
    clients &&
    clients.map((client) => {
      return {
        actions: "",
        id: client._id,
        alias: client.alias,
        name: { label: client.name, link: `/clientes/${client._id}` },
        testSystems: client.testSystems?.map((testSystem) => testSystem.alias),
        projects: [...client.projects].map((project) => project.alias),
        options: "",
      }
    })

  const projects_table = {
    components: {
      text: <Text />,
      link: <LinkItem />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      testSystems: <TagGroup variant="light_blue" max={3} />,
      projects: <TagGroup variant="pale_yellow" max={7} />,
      options: <RowOptionMenu onDelete={onDelete} onEdit={onEdit} />,
    },
    head: {
      actions: {
        label: "",
        width: calcColWidth(32),
        type: "selector",
      },
      id: {
        label: "id",
        width: calcColWidth(80),
        type: "text",
      },
      alias: {
        label: "Alias",
        width: calcColWidth(80),
        type: "text",
      },
      name: {
        label: "Nombre",
        width: calcColWidth(300),
        type: "link",
      },
      testSystems: {
        label: "Sistemas de ensayo",
        width: calcColWidth(250),
        type: "tagGroup",
      },
      projects: {
        label: "Proyectos",
        width: calcColWidth(300),
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
          count={_clients?.length}
          countLable="Clientes"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={handleSelectAllRows}
        />
      }
      config={projects_table}
      content={_clients}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      p="32px"
      pb="0"
      tableHeight={"calc(100vh - 190px)"}
    />
  )
}
