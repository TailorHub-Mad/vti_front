import { AddIcon } from "@chakra-ui/icons"
import { FormController } from "../components/forms/FormItemWrapper/FormController"
import { LogoFull } from "../components/images/LogoFull/LogoFull"
import { Page } from "../components/layout/Page/Page"
import { Popup } from "../components/overlay/Popup/Popup"

const {
  Text,
  Box,
  Heading,
  Center,
  Input,
  Button,
  IconButton,
} = require("@chakra-ui/react")

const Index = () => (
  <Page>
    <Center h="100vh">
      <Box maxWidth="850px">
        <LogoFull />
        <FormController
          label="Nombre de usuario:"
          error="Esto es un test de error"
          isRequired
          isInvalid
        >
          <Input placeholder="Input de prueba" />
        </FormController>
        <FormController
          label="Nombre de usuario:"
          error="Esto es un test de error"
          isRequired
          isInvalid
          helper="Si necesitas ayuda contacta con nosotros"
          marginTop="24px"
        >
          <Input placeholder="Input de prueba" />
        </FormController>
        <Popup isOpen={false} variant="info" />
        <Box display="grid" gridGap="8px" margin="32px 0" gridTemplateColumns="auto auto auto auto">
          <Button isDisabled>Hola que tal</Button>
          <Button>Hola que tal</Button>
          <Button variant="secondary">Hola que tal</Button>
          <Button variant="secondary" isLoading>Hola que tal</Button>
          <Button variant="primary" isLoading>Hola que tal</Button>
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
          Apparently we had reached a great height in the atmosphere, for the sky was
          a dead black, and the stars had ceased to twinkle. By the same illusion
          which lifts the horizon of the sea to the level of the spectator on a
          hillside, the sable cloud beneath was dished out, and the car seemed to
          float in the middle of an immense dark sphere, whose upper half was strewn
          with silver. Looking down into the dark gulf below, I could see a ruddy
          light streaming through a rift in the clouds.
        </Text>
      </Box>
    </Center>
  </Page>
)

export default Index
