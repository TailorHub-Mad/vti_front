import { Checkbox, Text } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"

export const DepartmentsTable = ({
  items: departments,
  onDelete,
  onEdit,
  onDeleteMany,
}) => {
  const {
    selectedRows,
    setSelectedRows,
    handleRowSelect,
    handleSelectAllRows,
    calcColWidth,
  } = useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [departments.length])

  const handleOnDelete = () => {
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(selectedRows)
    return onDelete(departments[selectedRows[0]].id)
  }

  const _departments =
    departments &&
    departments.map((department) => {
      return {
        actions: "",
        id: department.id,
        name: { label: department.name, link: `/departamentos/${department.id}` },
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
          count={_departments?.length}
          countLabel="Departamentos"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(_departments)}
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
