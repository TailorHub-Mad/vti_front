import { useContext } from "react"
import { Page } from "../components/layout/Page/Page"
import { PageHeader } from "../components/layout/PageHeader/PageHeader"
import { LoadingTableSpinner } from "../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import { ApiUserContext } from "../provider/ApiAuthProvider"
import { TestSystemsEmptyState } from "../views/test_systems/TestSystemsEmptyState/TestSystemsEmptyState"
import { TestSystemsTable } from "../views/test_systems/TestSystemsTable/TestSystemsTable"
import { TestSystemsToolbar } from "../views/test_systems/TestSystemsToolbar/TestSystemsToolbar"
import useSystemApi from "../hooks/api/useSystemsApi"
import useFetchSWR from "../hooks/useFetchSWR"

const sistemas = () => {
  const { isLoggedIn } = useContext(ApiUserContext)
  const { systems } = useSystemApi()

  const { data, error, isLoading } = useFetchSWR("systems/", systems)

  if (error) return <>ERROR...</>

  const emptyData = !data ?? data[0].testSystem.length > 0

  return !isLoggedIn ? (
    <>Loading...</>
  ) : (
    <Page>
      <PageHeader title="Sistemas de ensayo">
        {!isLoading && !emptyData && <TestSystemsToolbar />}
      </PageHeader>
      {isLoading && <LoadingTableSpinner />}
      {data && emptyData && <TestSystemsEmptyState />}
      {!isLoading && !emptyData && <TestSystemsTable items={data[0].testSystem} />}
    </Page>
  )
}

export default sistemas
