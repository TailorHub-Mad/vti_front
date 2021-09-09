import { Checkbox, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { RowOptionMenu } from "../../../components/navigation/RowOptionMenu/RowOptionMenu"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"

export const DepartmentsTable = ({ departments, onDelete, onEdit, deleteItems }) => {
  //TODO Crear el estado "finalizado" para que se sobreponga el color en verde
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()
  const [activeItem, setActiveItem] = useState("all")
  const _departments =
    departments &&
    departments.map((department) => {
      return {
        actions: "",
        id: department._id,
        name: { label: department.name, link: `/departamentos/${department._id}` },
        users: ["Usuario 1", "Usuario 2", "Usuario 3"],
        options: "",
      }
    })

  const departments_table = {
    components: {
      text: <Text />,
      link: <LinkItem />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      users: <TagGroup variant="pale_yellow" max={7} />,
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
      name: {
        label: "Departamento",
        width: calcColWidth(120),
        type: "link",
      },
      users: {
        label: "Usuarios",
        width: calcColWidth(815),
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
          departmentsCount={departments?.length}
          activeItem={activeItem}
          onChange={(value) => setActiveItem(value)}
          selectedRows={selectedRows}
          deleteItems={(items) => deleteItems(items)}
        />
      }
      config={departments_table}
      content={_departments}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      p="32px"
      pb="0"
      tableHeight={"calc(100vh - 190px)"}
    />
  )
}
