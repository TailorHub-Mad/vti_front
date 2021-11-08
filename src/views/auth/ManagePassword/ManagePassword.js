import { Button, Center, Flex, Input, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { FormController } from "../../../components/forms/FormItemWrapper/FormController"
import { Card } from "../../../components/cards/Card"
import { Formik } from "formik"
import useAuthApi from "../../../hooks/api/useAuthApi"
import { checkFormIsEmpty } from "../../../utils/functions/forms"
import { LogoFull } from "../../../components/images/LogoFull"
import { useRouter } from "next/dist/client/router"
import { PATHS } from "../../../utils/constants/global"

export const ManagePassword = ({ title, subtitle }) => {
  const router = useRouter()
  const { recoveryPassword } = useAuthApi()

  const [hasError, setHasError] = useState(false)

  const {
    query: { id }
  } = router

  const handleSubmit = async (data) => {
    const { password, validate } = data

    if (password !== validate) {
      setTimeout(() => {
        setHasError(false)
      }, 3000)
      return setHasError(true)
    }
    await recoveryPassword({
      password,
      recovery: id.toString()
    })

    setHasError(false)
    router.push(PATHS.login)
  }

  return (
    <Center
      w="100vw"
      h="100vh"
      background={"url(/images/backgrounds/general_bg.svg)"}
      bgRepeat="no-repeat"
      bgAttachment="fixed"
      bgSize="cover"
      bgPosition="center"
    >
      <Card
        width="492px"
        p={["32px 16px 56px 16px", null, null, "32px 48px 56px 48px"]}
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
          {title}
        </Text>
        <Text
          variant="d_m_regular"
          align="left"
          w="100%"
          marginBottom="16px"
          color="#052E57"
        >
          {subtitle}
        </Text>
        <Formik
          initialValues={{ password: "", validate: "" }}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values)
            setSubmitting(false)
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} style={{ width: "100%" }}>
              <FormController label="Crea una nueva contraseña*" mb="24px">
                <Input
                  name="password"
                  placeholder="Escribe tu contraseña"
                  onChange={props.handleChange}
                  value={props.values.password}
                  isInvalid={hasError}
                  color={hasError ? "#F95C5C" : "#052E57"}
                  errorBorderColor="#F95C5C"
                  type="password"
                />
              </FormController>

              <FormController label="Repite tu nueva contraseña*" mb="24px">
                <Input
                  name="validate"
                  placeholder="Escribe tu contraseña"
                  onChange={props.handleChange}
                  value={props.values.validate}
                  isInvalid={hasError}
                  color={hasError ? "#F95C5C" : "#052E57"}
                  errorBorderColor="#F95C5C"
                  type="password"
                />
              </FormController>

              {hasError && (
                <Text mb="24px" color="error">
                  Las contraseñas deben coincidir
                </Text>
              )}

              <Flex justifyContent="center">
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  disabled={checkFormIsEmpty(props.values)}
                >
                  Confirmar
                </Button>
              </Flex>
            </form>
          )}
        </Formik>
      </Card>
    </Center>
  )
}
