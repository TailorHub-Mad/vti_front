import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useDepartmentApi from "../../hooks/api/useDepartmentApi"


const department = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [department, setDepartment] = useState(null)
  const { getDepartment } = useDepartmentApi()
  const router = useRouter()
  useEffect(() => {
    setIsFetching(true)
    const fetchSector = async () => {
      const department = await getDepartment(router.query.id)
      setDepartment(department)
      setIsFetching(false)
    }
    fetchSector()
  }, [])
  return (
    <Page>
      {isFetching ? <LoadingTableSpinner /> : null}

      {department && !isFetching ? (
        <>
          <PageHeader>
            <BreadCrumbs lastText="Proyectos" />
            {/* <ProjectsToolBar /> */}
          </PageHeader>
          {/* <ProjectsTable items={MOCK_BACK_PROJECTS_DATA} /> */}
        </>
      ) : null}
    </Page>
  )
}

export default department
