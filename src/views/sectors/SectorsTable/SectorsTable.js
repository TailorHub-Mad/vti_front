import { Checkbox, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { LinkItem } from "../../../components/navigation/LinkItem/LinkItem"
import { RowOptionMenu } from "../../../components/navigation/RowOptionMenu/RowOptionMenu"
import { Table } from "../../../components/tables/Table/Table"
import { TableHeader } from "../../../components/tables/TableHeader/TableHeader"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"

export const SectorsTable = ({ sectors, onDelete, onEdit, deleteItems }) => {
  //TODO Crear el estado "finalizado" para que se sobreponga el color en verde
  //Hacer componente sectorLink
  const { selectedRows, handleRowSelect, calcColWidth } = useTableActions()
  const [activeItem, setActiveItem] = useState("all")
  const _sectors =
    sectors &&
    sectors.map((sector) => {
      return {
        actions: "",
        id: sector._id,
        name: { label: sector.name, link: `/sectores/${sector._id}` },
        projects: [],
        options: "",
      }
    })

  const sectors_table = {
    components: {
      text: <Text />,
      link: <LinkItem />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      projects: <TagGroup variant="pale_yellow" max={7} />,
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
          sectorsCount={sectors?.length}
          activeItem={activeItem}
          onChange={(value) => setActiveItem(value)}
          selectedRows={selectedRows}
          deleteItems={(items) => deleteItems(items)}
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
