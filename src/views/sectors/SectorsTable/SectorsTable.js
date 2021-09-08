import { Checkbox, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { SectorLink } from "../../../components/navigation/SectorLink/SectorLink"
import { Table } from "../../../components/tables/Table/Table"
import { TagGroup } from "../../../components/tags/TagGroup/TagGroup"
import useTableActions from "../../../hooks/useTableActions"
import { SectorsTableHeader } from "../SectorsTableHeader/SectorsTableHeader"
import { SectorRowOptionMenu } from "./SectorRowOptionMenu/SectorRowOptionMenu"

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
        name: { label: sector.name, link: sector._id },
        projects: ["Hola", "k ase"],
        options: "",
      }
    })

  const sectors_table = {
    components: {
      text: <Text />,
      link: <SectorLink />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      projects: <TagGroup variant="pale_yellow" max={7} />,
      options: <SectorRowOptionMenu onDelete={onDelete} onEdit={onEdit} />,
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
        <SectorsTableHeader
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
