import { Checkbox, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { PATHS } from "../../../utils/constants/paths"

export const UsersTable = ({ users = [], onDelete, onEdit, onDeleteMany }) => {
  const {
    selectedRows,
    setSelectedRows,
    handleRowSelect,
    handleSelectAllRows,
    calcColWidth
  } = useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [users.length])

  const handleOnDelete = () => {
    const usersId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(usersId)
    return onDelete(usersId[0])
  }

  const _users = users?.map((user) => {
    return {
      actions: "",
      id: user.ref,
      alias: user.alias,
      name: { label: user.name, link: `${PATHS.users}/${user._id}` },
      testSystems: user.testSystems?.map((testSystem) => testSystem.alias),
      projects: user.projects?.map((project) => project.alias),
      options: ""
    }
  })

  const projects_table = {
    components: {
      text: <Text />,
      link: <LinkItem />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      department: <TagGroup variant="light_blue" max={1} />,
      projects: <TagGroup variant="pale_yellow" max={7} />,
      focalPoints: <TagGroup variant="pale_yellow" max={7} />,
      options: <OptionsMenuRow onDelete={onDelete} onEdit={onEdit} />
    },
    head: {
      actions: {
        label: "",
        width: calcColWidth(32),
        type: "selector"
      },
      id: {
        label: "ID",
        width: calcColWidth(80),
        type: "text"
      },
      alias: {
        label: "Alias",
        width: calcColWidth(80),
        type: "text"
      },
      fullName: {
        label: "Nombre",
        width: calcColWidth(80),
        type: "link"
      },
      email: {
        label: "Email",
        width: calcColWidth(80),
        type: "text"
      },
      department: {
        label: "Departamento",
        width: calcColWidth(80),
        type: "tagGroup"
      },
      focalPoints: {
        label: "Punto focal proyectos",
        width: calcColWidth(200),
        type: "tagGroup"
      },
      projects: {
        label: "Proyectos",
        width: calcColWidth(250),
        type: "tagGroup"
      },
      options: {
        label: "",
        width: calcColWidth(2),
        type: "component"
      }
    }
  }

  return (
    <Table
      header={
        <TableHeader
          count={_users?.length}
          countLabel="Usuarios"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(_users)}
          checked={Object.keys(selectedRows).length === _users?.length}
        />
      }
      config={projects_table}
      content={_users}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight={"calc(100vh - 190px)"}
      p="32px"
      pb="0"
    />
  )
}
