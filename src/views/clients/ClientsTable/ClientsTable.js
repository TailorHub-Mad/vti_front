import { Checkbox, Text } from "@chakra-ui/react"
import { useMemo } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { PATHS } from "../../../utils/constants/paths"

export const ClientsTable = ({ clients = [], onDelete, onEdit, onDeleteMany }) => {
  const {
    selectedRows,
    setSelectedRows,
    handleRowSelect,
    handleSelectAllRows,
    calcColWidth
  } = useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [clients.length])

  const handleOnDelete = () => {
    const clientsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(clientsId)
    return onDelete(clientsId[0])
  }

  const _clients = clients?.map((client) => {
    return {
      actions: "",
      id: client._id,
      alias: client.alias,
      name: { label: client.name, link: `${PATHS.clients}/${client._id}` },
      testSystems: client.testSystems?.map((testSystem) => testSystem.alias),
      projects: client.projects?.map((project) => project.alias),
      options: ""
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
      name: {
        label: "Nombre",
        width: calcColWidth(300),
        type: "link"
      },
      testSystems: {
        label: "Sistemas de ensayo",
        width: calcColWidth(250),
        type: "tagGroup"
      },
      projects: {
        label: "Proyectos",
        width: calcColWidth(300),
        type: "tagGroup"
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
        <TableHeader
          count={_clients?.length}
          countLabel="Clientes"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(_clients)}
          checked={Object.keys(selectedRows).length === _clients?.length}
        />
      }
      config={projects_table}
      content={_clients}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      tableHeight={"calc(100vh - 190px)"}
      p="32px"
      pb="0"
    />
  )
}
