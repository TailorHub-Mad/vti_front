import { Checkbox, Text } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { PATHS } from "../../../utils/constants/paths"

export const DepartmentsTable = ({
  departments,
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
    const departmentsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(departmentsId)
    return onDelete(departmentsId[0])
  }

  const _departments = departments?.map((department) => {
    return {
      actions: "",
      id: department._id,
      name: {
        label: department.name,
        link: `${PATHS.departments}/${department._id}`,
      },
      users: [], // TODO
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
