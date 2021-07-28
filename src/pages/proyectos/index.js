import { useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageBody } from "../../components/layout/PageBody/PageBody"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { PageMenu } from "../../components/layout/PageMenu/PageMenu"
import { ProjectLink } from "../../components/navigation/ProjectLink/ProjectLink"
import { Table } from "../../components/tables/Table/Table"
import { TableOptionsMenu } from "../../components/tables/TableOptionsMenu/TableOptionsMenu"
import { NoteTag } from "../../components/tags/NoteTag/NoteTag"
import { TagGroup } from "../../components/tags/TagGroup/TagGroup"
import { MIN_TABLE_WIDTH } from "../../utils/constants/layout"
import { getPercentage } from "../../utils/functions/calculations"
import { NotesEmptyState } from "../../views/notes/NotesEmptyState/NotesEmptyState"
import { NotesMenu } from "../../views/notes/NotesMenu/NotesMenu"
import { NotesToolBar } from "../../views/notes/NotesToolBar/NotesToolBar"

const { Text, Checkbox, Center, Spinner } = require("@chakra-ui/react")

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

  const projects_table = {
    components: {
      text: <Text />,
      link: <ProjectLink />,
      count: <Text />,
      actions: <Checkbox marginLeft="8px" colorScheme="blue" defaultIsChecked />,
      sector: <NoteTag />,
      sistemas_ensayo: <TagGroup variant="testSystem" max={2} />,
      tags_proyecto: <TagGroup variant="project" max={4} />,
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
        width: calcProp(90),
        type: "text",
      },
      alias: {
        label: "Alias",
        width: calcProp(100),
        type: "link",
      },
      sector: {
        label: "Sector",
        width: calcProp(120),
        type: "text",
      },
      punto_focal: {
        label: "Punto Focal",
        width: calcProp(120),
        type: "text",
      },
      sistemas_ensayo: {
        label: "sistemas de ensayo",
        width: calcProp(200),
        type: "tagGroup",
      },
      tags_proyecto: {
        label: "Tags de proyecto",
        width: calcProp(220),
        type: "tagGroup",
      },
      usuarios: {
        label: "Usuarios",
        width: calcProp(80),
        type: "count",
      },
      apuntes: {
        label: "Apuntes",
        width: calcProp(60),
        type: "count",
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
    alias: {label: "US001", link: "ALIAS01R"},
    sector: "Aeroespacial",
    punto_focal: "Fernando gómez",
    sistemas_ensayo: ["Sistema2", "Sistema2", "Sistema2", "Sistema2", "Sistema2"],
    tags_proyecto: [
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
      "Tag asdfa",
    ],
    usuarios: [
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
    ],
    apuntes: [
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
      "TagProyecto2",
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
            config={projects_table}
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
