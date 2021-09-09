import { Checkbox, Text } from "@chakra-ui/react"
import React from "react"
import { ProjectLink } from "../../../components/navigation/ProjectLink/ProjectLink"
import { Table } from "../../../components/tables/Table/Table"
import { NoteTag } from "../../../components/tags/NoteTag/NoteTag"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { ProjectsTableHeader } from "../ProjectsTableHeader/ProjectsTableHeader"
import { ProjectRowOptionMenu } from "./ProjectRowOptionMenu/ProjectRowOptionMenu"

export const ProjectsTable = ({ items, activeTab, onTabChange }) => {
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()
  const elements = items?.map((e) => ({
    actions: "",
    id: e._id,
    alias: { label: e.alias, link: e._id },
    sector: e.sector || "Automoción",
    focusPoint: e.focusPoint.length > 0 ? e.focusPoint : ["Persona", "Responsable"],
    testSystems: e.testSystems.map((ts) => ts.alias),
    tags:
      e.tag.length > 0
        ? e.tag
        : ["Tag Proyecto A", "Tag Proyecto B", "Tag Proyecto C"],
    usuarios: e.users || ["User A", "User B", "User C"],
    notes: e.notes.map((note) => note.title),
    options: "",
    config: {
      isFinished: e.isFinished,
    },
  }))
  const projects_table = {
    components: {
      text: <Text />,
      link: <ProjectLink />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      sector: <NoteTag />,
      testSystems: <TagGroup variant="light_blue" max={3} />,
      tags: <TagGroup variant="pale_yellow" max={3} />,
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
      focusPoint: {
        label: "Punto Focal",
        width: calcColWidth(120),
        type: "text",
      },
      testSystems: {
        label: "sistemas de ensayo",
        width: calcColWidth(220),
        type: "tagGroup",
      },
      tags: {
        label: "Tags de proyecto",
        width: calcColWidth(220),
        type: "tagGroup",
      },
      usuarios: {
        label: "Usuarios",
        width: calcColWidth(60),
        type: "count",
      },
      notes: {
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
          activeItem={activeTab}
          onChange={(value) => onTabChange(value)}
          projectsCount={elements?.length}
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
