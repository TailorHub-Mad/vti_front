import { Checkbox, Text } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Table } from "../../../components/tables/Table/Table"
import { NoteTag } from "../../../components/tags/NoteTag/NoteTag"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { PATHS } from "../../../utils/constants/paths"
import { ProjectsTableHeader } from "./ProjectsTableHeader"

export const ProjectsTable = ({
  items,
  activeTab,
  onTabChange,
  onDelete,
  onDeleteMany,
  onEdit,
  isGrouped,
}) => {
  const {
    selectedRows,
    setSelectedRows,
    handleSelectAllRows,
    handleRowSelect,
    calcColWidth,
  } = useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [items?.length])

  const handleOnDelete = () => {
    if (selectedRows.length > 1) return onDeleteMany(selectedRows)
    return onDelete(selectedRows[0])
  }

  const transformProjectData = (e) => ({
    actions: "",
    id: e._id,
    alias: { label: e.alias, link: `${PATHS.projects}/${e._id}` },
    sector: e.sector ? e.sector[0]?.title : "",
    focusPoint:
      e.focusPoint?.length > 0
        ? e.focusPoint.map((fp) => fp.alias).join(", ")
        : ["Persona", "Responsable"],
    testSystems: e.testSystems?.map((ts) => ts.alias),
    tags: e.tag,
    users: e.users,
    notes: e.notes?.map((note) => note.title),
    options: "",
    config: {
      isFinished: e.isFinished,
    },
  })

  const _projects = items
    ? !isGrouped
      ? items?.map(transformProjectData)
      : items.map((it) => {
          const _it = [...it]
          _it[1] = it[1].map(transformProjectData)
          return _it
        })
    : null

  const projects_table = {
    components: {
      text: <Text />,
      link: <LinkItem />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      sector: <NoteTag />,
      testSystems: <TagGroup variant="light_blue" max={3} />,
      tags: <TagGroup variant="pale_yellow" max={3} />,
      options: <OptionsMenuRow onDelete={onDelete} onEdit={onEdit} />,
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
      users: {
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
          onChange={onTabChange}
          projectsCount={_projects?.length}
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(_projects)}
        />
      }
      config={projects_table}
      content={_projects}
      selectedRows={selectedRows}
      onRowSelect={(id) => handleRowSelect(id)}
      tableHeight="calc(100vh - 195px)"
      p="32px"
      pb="0"
      isGrouped={isGrouped}
    />
  )
}
