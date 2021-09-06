import { Checkbox, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { ProjectLink } from "../../../components/navigation/ProjectLink/ProjectLink"
import { Table } from "../../../components/tables/Table/Table"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { ClientsTableHeader } from "../ClientsTableHeader/ClientsTableHeader"
import { ClientRowOptionMenu } from "./ClientRowOptionMenu/ClientRowOptionMenu"

export const ClientsTable = ({ clients, onDelete, onEdit, deleteItems }) => {
  //TODO Crear el estado "finalizado" para que se sobreponga el color en verde
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()
  const [activeItem, setActiveItem] = useState("all")
  const _clients =
    clients &&
    clients.map((client) => {
      return {
        actions: "",
        id: client._id,
        alias: client.alias,
        name: { label: client.name, link: client._id },
        testSystem: client.testSystem.map((testSystem) => testSystem.alias),
        projects: [...client.projects].map((project) => project.alias),
        options: "",
      }
    })

  const projects_table = {
    components: {
      text: <Text />,
      link: <ProjectLink />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      testSystem: <TagGroup variant="light_blue" max={3} />,
      projects: <TagGroup variant="pale_yellow" max={7} />,
      options: <ClientRowOptionMenu onDelete={onDelete} onEdit={onEdit} />,
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
      testSystem: {
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
        <ClientsTableHeader
          clientsCount={clients?.length}
          activeItem={activeItem}
          onChange={(value) => setActiveItem(value)}
          selectedRows={selectedRows}
          deleteItems={(items) => deleteItems(items)}
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
