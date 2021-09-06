import { Checkbox, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { ProjectLink } from "../../../components/navigation/ProjectLink/ProjectLink"
import { Table } from "../../../components/tables/Table/Table"
import { NoteTag } from "../../../components/tags/NoteTag/NoteTag"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { ProjectsTableHeader } from "../ProjectsTableHeader/ProjectsTableHeader"
import { ProjectRowOptionMenu } from "./ProjectRowOptionMenu/ProjectRowOptionMenu"

export const ProjectsTable = ({ items }) => {
  console.log(items)
  //TODO Crear el estado "finalizado" para que se sobreponga el color en verde
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()
  const [activeItem, setActiveItem] = useState("all")
  const elements = items.map((e) => ({
    actions: "",
    id: e.id,
    alias: e.alias,
    sector: e.sector,
    punto_focal: e.focusPoint || "",
    sistemas_ensayo: e.testSystems,
    tags_proyecto: e.tags,
    users: [""],
    apuntes: e.notes,
    options: "",
  }))
  const projects_table = {
    components: {
      text: <Text />,
      link: <ProjectLink />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      sector: <NoteTag />,
      sistemas_ensayo: <TagGroup variant="light_blue" max={3} />,
      tags_proyecto: <TagGroup variant="pale_yellow" max={3} />,
      options: <ProjectRowOptionMenu />,
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
        width: calcColWidth(220),
        type: "tagGroup",
      },
      tags_proyecto: {
        label: "Tags de proyecto",
        width: calcColWidth(220),
        type: "tagGroup",
      },
      usuarios: {
        label: "Usuarios",
        width: calcColWidth(60),
        type: "count",
      },
      apuntes: {
        label: "Apuntes",
        width: calcColWidth(55),
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
          projectsCount={elements.length}
        />
      }
      config={projects_table}
      content={elements}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight="calc(100vh - 195px)"
      p="32px"
      pb="0"
    />
  )
}
