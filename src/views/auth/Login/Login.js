import { Button, Center, Flex, Input } from "@chakra-ui/react"
import React from "react"
import { FormController } from "../../../components/forms/FormItemWrapper/FormController"
import { LogoFull } from "../../../components/images/LogoFull/LogoFull"
import { Card } from "../../../components/layout/Card/Card"
import { Formik } from "formik"
import AuthService from "../../../services/auth.service"

export const Login = () => {
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
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const data = await new AuthService().login({ ...values })
              console.log("data response", data)
              setSubmitting(false)
            } catch (error) {
              console.log("error", error)
            }
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} style={{ width: "100%" }}>
              <FormController label="Email" mb="24px">
                <Input
                  name="email"
                  placeholder=""
                  onChange={props.handleChange}
                  value={props.values.email}
                />
              </FormController>
              <FormController label="Contraseña" mb="24px">
                <Input
                  name="password"
                  placeholder=""
                  type="password"
                  onChange={props.handleChange}
                  value={props.values.password}
                />
              </FormController>
              <Flex justifyContent="center">
                <Button type="submit" isLoading={props.isSubmitting}>
                  Entrar
                </Button>
              </Flex>
            </form>
          )}
        </Formik>
      </Card>
    </Center>
  )
}
