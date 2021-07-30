import { useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageBody } from "../../components/layout/PageBody/PageBody"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import { MOCK_TABLE_DATA } from "../../mock/projects_table"
import { NotesEmptyState } from "../../views/notes/NotesEmptyState/NotesEmptyState"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { ProjectsToolBar } from "../../views/projects/ProjectsToolBar/ProjectsToolBar"

const projects = () => {
  const isFetching = false
  const projects = new Array(50).fill("")
  const areProjects = projects && projects.length > 0
  //TODO Fetch de la lista de proyectos, gestion de la carga y pasarlo a la tabla por props
  return (
    <Page>
      <PageHeader title="Proyectos">
        {areProjects && !isFetching ? <ProjectsToolBar /> : null}
      </PageHeader>
        {isFetching ? <LoadingTableSpinner /> : null}
        {!areProjects ? <NotesEmptyState /> : null}
        {areProjects && !isFetching ? (
          <ProjectsTable items={MOCK_TABLE_DATA} />
        ) : null}
    </Page>
  )
}

export default projects
