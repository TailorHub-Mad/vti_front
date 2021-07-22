
import { useState } from "react"
import { Page } from "../components/layout/Page/Page"
import { Table } from "../components/tables/Table/Table"
import { TableOptionsMenu } from "../components/tables/TableOptionsMenu/TableOptionsMenu"
import { NoteTag } from "../components/tags/NoteTag/NoteTag"
import { TagGroup } from "../components/tags/TagGroup/TagGroup"
import { MIN_TABLE_WIDTH } from "../utils/constants/layout"
import { getPercentage } from "../utils/functions/calculations"

const { Text, Checkbox } = require("@chakra-ui/react")

const table = () => {
  const [selectedRows, setSelectedRows] = useState([])
  const calcProp = (width) => `${getPercentage(MIN_TABLE_WIDTH, width)}%`

  const handleRowSelect = (idx) => {
    if (selectedRows.includes(idx)) {
      const nextItems = selectedRows.filter((item) => item !== idx)
      setSelectedRows(nextItems)
      return
    }
    setSelectedRows([...selectedRows, idx])
  }

  const user_table = {
    components: {
      text: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      departamento: <NoteTag />,
      pfocal_proyectos: <TagGroup variant="testSystem" max={2} />,
      proyectos_comentados: <TagGroup variant="project" max={4} />,
      options: <TableOptionsMenu />,
    },
    head: {
      actions: {
        label: "",
        width: calcProp(32),
        type: "selector",
      },
      id: {
        label: "id",
        width: calcProp(85),
        type: "text",
      },
      alias: {
        label: "Alias",
        width: calcProp(85),
        type: "text",
      },
      nombre: {
        label: "Nombre",
        width: calcProp(140),
        type: "text",
      },
      email: {
        label: "Email",
        width: calcProp(180),
        type: "text",
      },
      departamento: {
        label: "Departamento",
        width: calcProp(90),
        type: "component",
      },
      pfocal_proyectos: {
        label: "Punto focal proyectos",
        width: calcProp(200),
        type: "tagGroup",
      },
      proyectos_comentados: {
        label: "Proyectos comentados",
        width: calcProp(280),
        type: "tagGroup",
      },
      options: {
        label: "",
        width: calcProp(20),
        type: "component",
      },
    },
  }

  const tableData = new Array(30).fill({
    actions: "",
    id: "ID001",
    alias: "US001",
    nombre: "Nombre y apellido",
    email: "nombreemail@vtisl.com",
    departamento: "Ingenieria",
    pfocal_proyectos: [
      "Proyecto1",
      "Proyecto2",
      "Proyecto2",
      "Proyecto2",
      "Proyecto2",
      "Proyecto2",
    ],
    proyectos_comentados: [
      "Proyecto1",
      "Proyecto2",
      "Proyecto2",
      "Proyecto2",
      "Proyecto2",
      "Proyecto2",
      "Proyecto2",
      "Proyecto2",
    ],
    options: "",
  })

  return (
    <Page>
      <Table
        config={user_table}
        content={tableData}
        selectedRows={selectedRows}
        onRowSelect={(idx) => handleRowSelect(idx)}
      />
    </Page>
  )
}

export default table
