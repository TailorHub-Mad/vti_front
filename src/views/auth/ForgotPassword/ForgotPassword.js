import { Button, Center, Flex, Input, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { FormController } from "../../../components/forms/FormItemWrapper/FormController"
import { Card } from "../../../components/cards/Card"
import { Formik } from "formik"
import { checkFormIsEmpty } from "../../../utils/functions/forms"
import { LogoFull } from "../../../components/images/LogoFull"
import useAuthApi from "../../../hooks/api/useAuthApi"
import { useRouter } from "next/dist/client/router"
import { PATHS } from "../../../utils/constants/global"

export const ForgotPassword = () => {
  const router = useRouter()
  const { sendRecoveryPassword } = useAuthApi()

  const [hasError] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [email, setEmail] = useState(null)

  const handleSubmit = async (data) => {
    setEmail(data.email)
    await sendRecoveryPassword(data)
    setShowMessage(true)
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
      {showMessage ? (
        <Card
          width="492px"
          p="32px 48px 56px 48px"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <LogoFull width="163px" color="blue.500" mb="32px" />
          <Text
            variant="d_m_regular"
            align="left"
            w="100%"
            color="#052E57"
            display="inline"
          >
            {`Le hemos enviado un correo electrónico a`}{" "}
            <span>
              {" "}
              <Text
                display="inline"
                variant="d_m_medium"
                align="left"
                color="#052E57"
              >
                {email}
              </Text>
            </span>{" "}
            {`con las
            instrucciones para restaurar su contraseña.`}
          </Text>
          <Button mt="48px" type="submit" onClick={() => router.push(PATHS.login)}>
            Volver al inicio
          </Button>
        </Card>
      ) : (
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
            No te preocupes, dinos por favor tu mail para restaurarla.
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
                    placeholder="Escribe tu email"
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
      )}
    </Center>
  )
}
