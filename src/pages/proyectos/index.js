import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Spinner } from "../../components/spinner/Spinner"
import { MOCK_TABLE_DATA } from "../../mock/projects_table"
import { NotesEmptyState } from "../../views/notes/NotesEmptyState/NotesEmptyState"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"

const projects = () => {
  const isFetching = false
  const projects = new Array(50).fill("")
  const areProjects = projects && projects.length > 0
  //TODO Fetch de la lista de proyectos, gestion de la carga y pasarlo a la tabla por props
  return (
    <Page>
      <PageHeader title="Proyectos">
        {areProjects && !isFetching ? <ToolBar /> : null}
      </PageHeader>
      {isFetching ? <Spinner /> : null}
      {!areProjects ? <NotesEmptyState /> : null}
      {areProjects && !isFetching ? <ProjectsTable items={MOCK_TABLE_DATA} /> : null}
    </Page>
  )
}

export default projects
