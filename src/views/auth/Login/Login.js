import { Button, Center, Flex, Input, Text } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { FormController } from "../../../components/forms/FormItemWrapper/FormController"
import { LogoFull } from "../../../components/images/LogoFull"
import { Card } from "../../../components/cards/Card"
import { Formik } from "formik"
import useAuthApi from "../../../hooks/api/useAuthApi"
import { ShowPassowrd, ForgotPassword } from "./Login.style"
import { HideLineIcon } from "../../../components/icons/HideLineIcon"
import { useRouter } from "next/dist/client/router"
import { setSessioncookie } from "../../../utils/functions/cookies"
import { checkFormIsEmpty } from "../../../utils/functions/forms"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"

export const Login = () => {
  const { login } = useAuthApi()
  const router = useRouter()
  const { setRole, setIsLoggedIn } = useContext(ApiAuthContext)

  const [hasError, setHasError] = useState(false)
  const [passwordInputType, setPasswordInputType] = useState("password")

  const handleOnClickShowPassword = () =>
    setPasswordInputType(passwordInputType == "password" ? "text" : "password")

  const handleOnClickForgotPassword = () => router.push("/recuperar")

  const handleSubmit = async (values) => {
    const response = await login({ ...values })

    if (response.error) {
      setTimeout(() => {
        setHasError(false)
      }, 3000)
      return setHasError(true)
    }

    const { token, role } = response

    setRole(role)
    setIsLoggedIn(true)
    setSessioncookie(token)

    router.push("/")
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
        <Formik
          initialValues={{ email: "", password: "" }}
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
                error={hasError && "Ha ocurrido un error"}
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

              <ForgotPassword onClick={handleOnClickForgotPassword}>
                <Text variant="d_s_regular" color="#052E57" cursor="pointer">
                  ¿No recuerda su contraseña?
                </Text>
              </ForgotPassword>
              <FormController label="Contraseña" mb="24px" error={hasError}>
                <Input
                  name="password"
                  placeholder="Escriba su contraseña"
                  type={passwordInputType}
                  isInvalid={hasError}
                  onChange={props.handleChange}
                  color={hasError ? "#F95C5C" : "#052E57"}
                  value={props.values.password}
                />
                <ShowPassowrd onClick={handleOnClickShowPassword}>
                  <HideLineIcon />
                </ShowPassowrd>
              </FormController>
              <Flex justifyContent="center">
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  disabled={checkFormIsEmpty(props.values)}
                >
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
