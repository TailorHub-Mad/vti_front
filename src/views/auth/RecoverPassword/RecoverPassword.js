import { Button, Center, Flex, Input, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { FormController } from "../../../components/forms/FormItemWrapper/FormController"
import { LogoFull } from "../../../components/images/LogoFull/LogoFull"
import { Card } from "../../../components/layout/Card/Card"
import { Formik } from "formik"

import { checkFormIsEmpty } from "../../../utils/functions/forms"

export const RecoverPassword = () => {
  const [hasError, _] = useState(false)

  const handleSubmit = async (values) => {
    //TODO API function
  }

  return (
    <Center
      w="100vw"
      h="100vh"
      background={"url(/images/backgrounds/general_bg.svg)"}
      backgroundPosition="0 -160px"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
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
        <Text
          variant="d_l_regular"
          align="left"
          w="100%"
          marginBottom="16px"
          color="#052E57"
        >
          ¿Has olvidado tu contraseña?
        </Text>
        <Text
          variant="d_m_regular"
          align="left"
          w="100%"
          marginBottom="16px"
          color="#052E57"
        >
          No te preocupes, dinos por favor tu email para restaurarla.
        </Text>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values)
            setSubmitting(false)
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} style={{ width: "100%" }}>
              <FormController
                label="Email"
                mb="24px"
                error={hasError && "Tu email no pertenece a la compañia"}
              >
                <Input
                  name="email"
                  placeholder="juan@vtisl.com"
                  onChange={props.handleChange}
                  value={props.values.email}
                  isInvalid={hasError}
                  color={hasError ? "#F95C5C" : "#052E57"}
                  errorBorderColor="#F95C5C"
                />
              </FormController>

              <Flex justifyContent="center">
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  disabled={checkFormIsEmpty(props.values)}
                >
                  Enviar email
                </Button>
              </Flex>
            </form>
          )}
        </Formik>
      </Card>
    </Center>
  )
}
