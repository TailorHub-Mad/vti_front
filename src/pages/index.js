import { AddIcon } from "@chakra-ui/icons"
import { useState } from "react"
import { AddSelect } from "../components/forms/AddSelect/AddSelect"
import { FormController } from "../components/forms/FormItemWrapper/FormController"
import { InputSelect } from "../components/forms/InputSelect/InputSelect"
import { SelectMenu } from "../components/forms/SelectMenu/SelectMenu"
import { LogoFull } from "../components/images/LogoFull/LogoFull"
import { Page } from "../components/layout/Page/Page"
import { Popup } from "../components/overlay/Popup/Popup"
import { MOCK_SELECT_OPTIONS } from "../mock/mock"

const {
  Text,
  Box,
  Heading,
  Center,
  Input,
  Button,
  IconButton,
} = require("@chakra-ui/react")

const Index = () => {
  const [mockSelectValue, setMockSelectValue] = useState("")
  return (
    <Page>
      <Center h="100vh">
        <Box maxWidth="850px">
          <LogoFull />
          <FormController
            label="Nombre de usuario:"
            error="Esto es un test de error"
            isRequired
            isInvalid
            marginBottom="16px"
          >
            <Input placeholder="Input de prueba" />
          </FormController>
          <FormController
            label="Nombre de usuario:"
            error="Esto es un test de error"
            isRequired
            isInvalid
            marginBottom="16px"
          >
            <Input placeholder="Input de prueba" />
          </FormController>
          <FormController
            label="Tag de proyecto"
            helper="Si necesitas ayuda contacta con nosotros"
            marginTop="24px"
            onHelperClick={() => console.log("Helper click")}
          >
            <InputSelect
              value={mockSelectValue}
              onChange={(val) => setMockSelectValue(val)}
              placeholder="Introduce tags"
              options={MOCK_SELECT_OPTIONS}
            />
          </FormController>
          <FormController
            label="Tags de proyecto"
            helper="Si necesitas ayuda contacta con nosotros"
            marginTop="24px"
            onHelperClick={() => console.log("Helper click")}
          >
            <AddSelect placeholder="Introduce tags" options={MOCK_SELECT_OPTIONS} />
          </FormController>
          <Popup isOpen={false} variant="info" />
          <Box
            display="grid"
            gridGap="8px"
            margin="32px 0"
            gridTemplateColumns="auto auto auto auto"
          >
            <Button isDisabled>Hola que tal</Button>
            <Button>Hola que tal</Button>
            <Button variant="secondary">Hola que tal</Button>
            <Button variant="secondary" isLoading>
              Hola que tal
            </Button>
            <Button variant="primary" isLoading>
              Hola que tal
            </Button>
            <Button variant="secondary" isDisabled>
              Hola que tal
            </Button>
            <Button leftIcon={<AddIcon />}>Hola que tal</Button>
          </Box>
          <IconButton variant="icon_only" icon={<AddIcon />} />
          <Heading margin="32px 0 8px 0">
            The spectacle before us was indeed sublime.
          </Heading>
          <Text casing="uppercase">
            Apparently we had reached a great height in the atmosphere, for the sky
            was a dead black, and the stars had ceased to twinkle. By the same
            illusion which lifts the horizon of the sea to the level of the spectator
            on a hillside, the sable cloud beneath was dished out, and the car seemed
            to float in the middle of an immense dark sphere, whose upper half was
            strewn with silver. Looking down into the dark gulf below, I could see a
            ruddy light streaming through a rift in the clouds.
          </Text>
        </Box>
      </Center>
    </Page>
  )
}

export default Index
