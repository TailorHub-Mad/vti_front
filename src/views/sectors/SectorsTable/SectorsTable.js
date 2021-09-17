import { Checkbox, Text } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { PATHS } from "../../../utils/constants/paths"

export const SectorsTable = ({ sectors, onDelete, onEdit, onDeleteMany }) => {
  const {
    selectedRows,
    setSelectedRows,
    handleRowSelect,
    handleSelectAllRows,
    calcColWidth,
  } = useTableActions()

  useMemo(() => {
    setSelectedRows([])
  }, [sectors.length])

  const handleOnDelete = () => {
    const sectorsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(sectorsId)
    return onDelete(sectorsId[0])
  }

  const _sectors = sectors?.map((sector) => {
    return {
      actions: "",
      id: sector._id,
      name: { label: sector.title, link: `${PATHS.sectors}/${sector._id}` },
      projects: sector.projects,
      options: "",
    }
  })

  const sectors_table = {
    components: {
      text: <Text />,
      link: <LinkItem />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      projects: <TagGroup variant="pale_yellow" max={7} />,
      options: <OptionsMenuRow onDelete={onDelete} onEdit={onEdit} />,
    },
    head: {
      actions: {
        label: "",
        width: calcColWidth(32),
        type: "selector",
      },
      id: {
        label: "ID",
        width: calcColWidth(80),
        type: "text",
      },
      name: {
        label: "Nombre",
        width: calcColWidth(120),
        type: "link",
      },
      projects: {
        label: "Proyectos",
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
          count={_sectors?.length}
          countLabel="Sectores"
          selectedRows={selectedRows}
          onDelete={handleOnDelete}
          selectAllRows={() => handleSelectAllRows(_sectors)}
        />
      }
      config={sectors_table}
      content={_sectors}
      selectedRows={selectedRows}
      onRowSelect={(idx) => handleRowSelect(idx)}
      p="32px"
      pb="0"
      tableHeight={"calc(100vh - 190px)"}
    />
  )
}
