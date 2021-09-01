import { Box, Button, Center, Input } from "@chakra-ui/react"
import React, { useState } from "react"
import { FormController } from "../components/forms/FormItemWrapper/FormController"
import { SimpleInput } from "../components/forms/SimpleInput/SimpleInput"
import { LogoFull } from "../components/images/LogoFull/LogoFull"
import { Card } from "../components/layout/Card/Card"

const auth = () => {
  const [values, setValues] = useState({ email: "", password: "" })
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })

  }

  return (
    <Center
      w="100vw"
      h="100vh"
      background={"url(/images/backgrounds/general_bg.svg)"}
      backgroundPosition="0 -60px"
    >
      <Card
        width="492px"
        height="410px"
        p="32px 48px 56px 48px"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <LogoFull width="163px" color="blue.500" mb="32px" />
        <FormController label="Email" mb="24px">
          <Input
            name="email"
            placeholder=""
            onChange={handleChange}
            value={values.email}
          />
        </FormController>
        <FormController label="Contraseña" mb="24px">
          <Input
            name="password"
            placeholder=""
            type="password"
            onChange={handleChange}
            value={values.password}
          />
        </FormController>

        <Button onClick={() => router.push("/")}>Entrar</Button>
      </Card>
    </Center>
  )
}

export default auth
