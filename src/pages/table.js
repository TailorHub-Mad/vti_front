import { useState } from "react"

import { Page } from "../components/layout/Page/Page"
import { UserTable } from "../components/tables/UserTable/UserTable"

const { Text, Box, Input, Button, IconButton, Grid } = require("@chakra-ui/react")

const table = () => {
  const [mockSelectValue, setMockSelectValue] = useState("")
  return (
    <Page>
      <UserTable />
    </Page>
  )
}

export default table
