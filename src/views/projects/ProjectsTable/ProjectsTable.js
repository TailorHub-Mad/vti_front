import { Checkbox, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { ProjectLink } from "../../../components/navigation/ProjectLink/ProjectLink"
import { Table } from "../../../components/tables/Table/Table"
import { TableOptionsMenu } from "../../../components/tables/TableOptionsMenu/TableOptionsMenu"
import { NoteTag } from "../../../components/tags/NoteTag/NoteTag"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { ProjectsTableHeader } from "../ProjectsTableHeader/ProjectsTableHeader"

export const ProjectsTable = ({ items }) => {
  //TODO Crear el estado "finalizado" para que se sobreponga el color en verde
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()
  const [activeItem, setActiveItem] = useState("all")
  const projects_table = {
    components: {
      text: <Text />,
      link: <ProjectLink />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      sector: <NoteTag />,
      sistemas_ensayo: <TagGroup variant="light_blue" max={3} />,
      tags_proyecto: <TagGroup variant="pale_yellow" max={3} />,
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
        width: calcColWidth(90),
        type: "text",
      },
      alias: {
        label: "Alias",
        width: calcColWidth(100),
        type: "link",
      },
      sector: {
        label: "Sector",
        width: calcColWidth(120),
        type: "text",
      },
      punto_focal: {
        label: "Punto Focal",
        width: calcColWidth(120),
        type: "text",
      },
      sistemas_ensayo: {
        label: "sistemas de ensayo",
        width: calcColWidth(200),
        type: "tagGroup",
      },
      tags_proyecto: {
        label: "Tags de proyecto",
        width: calcColWidth(220),
        type: "tagGroup",
      },
      usuarios: {
        label: "Usuarios",
        width: calcColWidth(80),
        type: "count",
      },
      apuntes: {
        label: "Apuntes",
        width: calcColWidth(60),
        type: "count",
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
        <ProjectsTableHeader
          activeItem={activeItem}
          onChange={(value) => setActiveItem(value)}
        />
      }
      config={projects_table}
      content={items}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      p="32px"
    />
  )
}
