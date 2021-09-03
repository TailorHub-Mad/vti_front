import { Page } from "../components/layout/Page/Page"
import { PageHeader } from "../components/layout/PageHeader/PageHeader"
import { LoadingTableSpinner } from "../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import { MOCK_TEST_SYSTEM_TABLE } from "../mock/test_system_table"
import { TestSystemsEmptyState } from "../views/test_systems/TestSystemsEmptyState/TestSystemsEmptyState"
import { TestSystemsTable } from "../views/test_systems/TestSystemsTable/TestSystemsTable"
import { TestSystemsToolbar } from "../views/test_systems/TestSystemsToolbar/TestSystemsToolbar"

const sistemas = () => {
  const isFetching = false
  const test_systems = new Array(50).fill("")
  const areSystems = test_systems && test_systems.length > 0
  //TODO Fetch de la lista de sistemas, gestion de la carga y pasarlo a la tabla por props

  return (
    <Page>
      <PageHeader title="Sistemas de ensayo">
        {areSystems && !isFetching ? <TestSystemsToolbar /> : null}
      </PageHeader>
      {isFetching ? <LoadingTableSpinner /> : null}
      {!areSystems ? <TestSystemsEmptyState /> : null}
      {areSystems && !isFetching ? (
        <TestSystemsTable items={MOCK_TEST_SYSTEM_TABLE} />
      ) : null}
    </Page>
  )
}

export default sistemas
