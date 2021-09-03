import { useState } from "react"
import { Page } from "../components/layout/Page/Page"
import { PageBody } from "../components/layout/PageBody/PageBody"
import { PageHeader } from "../components/layout/PageHeader/PageHeader"
import { PageMenu } from "../components/layout/PageMenu/PageMenu"
import { Table } from "../components/tables/Table/Table"
import { TableOptionsMenu } from "../components/tables/TableOptionsMenu/TableOptionsMenu"
import { NoteTag } from "../components/tags/NoteTag/NoteTag"
import { TagGroup } from "../components/tags/TagGroup/TagGroup"
import { MIN_TABLE_WIDTH } from "../utils/constants/layout"
import { getPercentage } from "../utils/functions/common"
import { NotesEmptyState } from "../views/notes/NotesEmptyState/NotesEmptyState"
import { NotesMenu } from "../views/notes/NotesMenu/NotesMenu"
import { NotesToolBar } from "../views/notes/NotesToolBar/NotesToolBar"
import { Text, Checkbox, Center, Spinner } from "@chakra-ui/reac"

const projects = () => {
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
        width: calcProp(89),
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
  const isFetching = false
  const notes = new Array(50).fill("")
  const areNotes = notes && notes.length > 0
  const [activeTab, setActiveTab] = useState("all")
  return (
    <Page>
      <PageHeader title="Proyectos">
        {areNotes && !isFetching ? <NotesToolBar /> : null}
      </PageHeader>
      <PageMenu>
        {areNotes && !isFetching ? (
          <NotesMenu
            activeItem={activeTab}
            notesCount={notes?.length}
            onChange={(value) => setActiveTab(value)}
          />
        ) : null}
      </PageMenu>
      <PageBody>
        {isFetching ? (
          <Center marginTop="150px">
            <Spinner size="xl" color="blue.500" />
          </Center>
        ) : null}
        {!areNotes ? <NotesEmptyState /> : null}
        {areNotes && !isFetching ? (
          <Table
            config={user_table}
            content={tableData}
            selectedRows={selectedRows}
            onRowSelect={(idx) => handleRowSelect(idx)}
          />
        ) : null}
      </PageBody>
    </Page>
  )
}

export default projects
