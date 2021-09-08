import { Checkbox, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { DepartmentLink } from "../../../components/navigation/DepartmentLink/DepartmentLink"
import { Table } from "../../../components/tables/Table/Table"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { DepartmentsTableHeader } from "../DepartmentsTableHeader/DepartmentsTableHeader"
import { DepartmentRowOptionMenu } from "./DepartmentRowOptionMenu/DepartmentRowOptionMenu"

export const DepartmentsTable = ({ departments, onDelete, onEdit, deleteItems }) => {
  //TODO Crear el estado "finalizado" para que se sobreponga el color en verde
  //Hacer componente departmentLink
  console.log("DEPART", departments)
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()
  const [activeItem, setActiveItem] = useState("all")
  const _departments =
    departments &&
    departments.map((department) => {
      return {
        actions: "",
        id: department._id,
        name: { label: department.name, link: department._id },
        users: ["Usuario 1", "Usuario 2", "Usuario 3"],
        options: "",
      }
    })

  const departments_table = {
    components: {
      text: <Text />,
      link: <DepartmentLink />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      users: <TagGroup variant="pale_yellow" max={7} />,
      options: <DepartmentRowOptionMenu onDelete={onDelete} onEdit={onEdit} />,
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
        <DepartmentsTableHeader
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
