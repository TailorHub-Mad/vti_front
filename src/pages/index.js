import { AddIcon } from "@chakra-ui/icons"
import { useState } from "react"
import { MessageCard } from "../components/cards/MessageCard/MessageCard"
import { AddSelect } from "../components/forms/AddSelect/AddSelect"
import { FormController } from "../components/forms/FormItemWrapper/FormController"
import { InputSelect } from "../components/forms/InputSelect/InputSelect"
import { SelectMenu } from "../components/forms/SelectMenu/SelectMenu"
import { LogoFull } from "../components/images/LogoFull/LogoFull"
import { Card } from "../components/layout/Card/Card"
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
  Grid,
} = require("@chakra-ui/react")

const Index = () => {
  const [mockSelectValue, setMockSelectValue] = useState("")
  return (
    <Page>
      <Box maxWidth="600px" width="100%" marginBottom="32px">
        <LogoFull color="blue" />
        <Text variant="d_l_medium" casing="uppercase" margin="32px 0 8px 0">
          The spectacle before us was indeed sublime.
        </Text>
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
      <Grid
        templateColumns="1fr 1fr 1fr"
        gap="16px"
        width="fit-content"
        marginBottom="32px"
      >
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
        <MessageCard />
      </Grid>
      <Box>
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
        <Box display="grid" gridGap="8px" margin="32px 0" gridTemplateColumns="auto">
          <Button isDisabled>Registrar proyecto</Button>
          <Button>Registrar proyecto</Button>
          <Button variant="secondary">Registrar proyecto</Button>
          <Button variant="secondary" isLoading>
            Registrar proyecto
          </Button>
          <Button variant="primary" isLoading>
            Registrar proyecto
          </Button>
          <Button variant="secondary" isDisabled>
            Registrar proyecto
          </Button>
          <Button leftIcon={<AddIcon />}>Registrar proyecto</Button>
          <IconButton variant="icon_only" icon={<AddIcon />} />
        </Box>
      </Box>
    </Page>
  )
}

export default Index
