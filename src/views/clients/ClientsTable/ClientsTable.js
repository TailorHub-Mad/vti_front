import { Checkbox, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { ProjectLink } from "../../../components/navigation/ProjectLink/ProjectLink"
import { Table } from "../../../components/tables/Table/Table"
import { TableOptionsMenu } from "../../../components/tables/TableOptionsMenu/TableOptionsMenu"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { ClientsTableHeader } from "../ClientsTableHeader/ClientsTableHeader"

export const ClientsTable = ({ items }) => {
  //TODO Crear el estado "finalizado" para que se sobreponga el color en verde
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()
  const [activeItem, setActiveItem] = useState("all")
  const projects_table = {
    components: {
      text: <Text />,
      link: <ProjectLink />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      sistemas_ensayo: <TagGroup variant="light_blue" max={3} />,
      proyectos: <TagGroup variant="pale_yellow" max={7} />,
      options: <TableOptionsMenu />,
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
      nombre: {
        label: "Nombre",
        width: calcColWidth(110),
        type: "link",
      },
      sistemas_ensayo: {
        label: "Sistemas de ensayo",
        width: calcColWidth(230),
        type: "tagGroup",
      },
      proyectos: {
        label: "Proyectos",
        width: calcColWidth(500),
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
          activeItem={activeItem}
          onChange={(value) => setActiveItem(value)}
        />
      }
      config={projects_table}
      content={items}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      p="32px"
      pb="0"
      tableHeight={"calc(100vh - 190px)"}
    />
  )
}
