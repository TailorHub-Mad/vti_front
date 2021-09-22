import { Checkbox, Text } from "@chakra-ui/react"
import React, { useMemo, useState } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Table } from "../../../components/tables/Table/Table"
import { NoteTag } from "../../../components/tags/NoteTag/NoteTag"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { fetchType } from "../../../utils/constants/global_config"
import { PATHS } from "../../../utils/constants/paths"
import { ProjectsTableHeader } from "./ProjectsTableHeader"

export const ProjectsTable = ({
  projects,
  onTabChange,
  onDelete,
  onDeleteMany,
  onEdit,
  isGrouped
}) => {
  const {
    selectedRows,
    setSelectedRows,
    handleSelectAllRows,
    handleRowSelect,
    calcColWidth
  } = useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [projects?.length])

  const [activeItem, setActiveItem] = useState(fetchType.ALL)

  const handleOnTabChange = (state) => {
    setActiveItem(state)
    onTabChange(state)
  }

  const handleOnDelete = () => {
    const projectsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(projectsId)
    return onDelete(projectsId[0])
  }

  const transformProjectData = (project) => ({
    actions: "",
    id: project.ref,
    alias: { label: project.alias, link: `${PATHS.projects}/${project._id}` },
    sector: project.sector[0]?.title || "---",
    focusPoint: project.focusPoint?.map((fp) => fp.alias).join(", ") || "---",
    testSystems: project.testSystems?.map((ts) => ts.alias) || "---",
    tags: project.tag?.map((ts) => ts.name),
    users: project.tag?.map((ts) => ts.alias),
    notes: project.notes?.map((note) => note.title),
    options: "",
    config: { isFinished: project.close }
  })

  const _projects = projects
    ? !isGrouped
      ? projects?.map(transformProjectData)
      : projects.map((it) => {
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
      options: <OptionsMenuRow onDelete={onDelete} onEdit={onEdit} />
    },
    head: {
      actions: {
        label: "",
        width: calcColWidth(32),
        type: "selector"
      },
      id: {
        label: "id",
        width: calcColWidth(90),
        type: "text"
      },
      alias: {
        label: "Alias",
        width: calcColWidth(100),
        type: "link"
      },
      sector: {
        label: "Sector",
        width: calcColWidth(120),
        type: "text"
      },
      focusPoint: {
        label: "Punto Focal",
        width: calcColWidth(120),
        type: "text"
      },
      testSystems: {
        label: "sistemas de ensayo",
        width: calcColWidth(220),
        type: "tagGroup"
      },
      tags: {
        label: "Tags de proyecto",
        width: calcColWidth(220),
        type: "tagGroup"
      },
      users: {
        label: "Usuarios",
        width: calcColWidth(60),
        type: "count"
      },
      notes: {
        label: "Apuntes",
        width: calcColWidth(55),
        type: "count"
      },
      options: {
        label: "",
        width: calcColWidth(20),
        type: "component"
      }
    }
  }

  return (
    <Table
      header={
        <ProjectsTableHeader
          activeItem={activeItem}
          onChange={handleOnTabChange}
          projectsCount={_projects?.length}
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(_projects)}
          checked={Object.keys(selectedRows).length === _projects?.length}
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
