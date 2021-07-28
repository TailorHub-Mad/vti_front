import { AddIcon } from "@chakra-ui/icons"
import { useState } from "react"
import { MessageCard } from "../components/cards/MessageCard/MessageCard"
import { NotificationCard } from "../components/cards/NotificationCard/NotificationCard"
import { AddSelect } from "../components/forms/AddSelect/AddSelect"
import { FormController } from "../components/forms/FormItemWrapper/FormController"
import { InputSelect } from "../components/forms/InputSelect/InputSelect"
import { LogoFull } from "../components/images/LogoFull/LogoFull"
import { Card } from "../components/layout/Card/Card"
import { Page } from "../components/layout/Page/Page"
import { Popup } from "../components/overlay/Popup/Popup"
import { MOCK_SELECT_OPTIONS } from "../mock/mock"

const {
  Text,
  Box,
  Input,
  Button,
  IconButton,
  Grid,
  Switch,
  Checkbox,
  RadioGroup,
  Stack,
  Radio,
} = require("@chakra-ui/react")

const Index = () => {
  const [mockSelectValue, setMockSelectValue] = useState("")
  const [value, setValue] = useState("")
  return (
    <Page>
      <Box maxWidth="600px" width="100%" marginBottom="32px">
        <LogoFull color="blue.500" />
        <Text variant="d_l_medium" casing="uppercase" margin="32px 0 8px 0">
          The spectacle before us was indeed sublime.
        </Text>
        <Text>
          Apparently we had reached a great height in the atmosphere, for the sky was
          a dead black, and the stars had ceased to twinkle. By the same illusion
          which lifts the horizon of the sea to the level of the spectator on a
          hillside, the sable cloud beneath was dished out, and the car seemed to
          float in the middle of an immense dark sphere, whose upper half was strewn
          with silver. Looking down into the dark gulf below, I could see a ruddy
          light streaming through a rift in the clouds.
        </Text>
      </Box>
      <Card margin="16px 0 32px 0" width="100%">
        <Switch marginRight="16px" />
        <Switch isDisabled />
      </Card>
      <Card margin="16px 0 32px 0" width="100%">
        <Checkbox marginRight="16px" />
        <Checkbox isDisabled />
      </Card>
      <Card margin="16px 0 32px 0" width="100%">
        <RadioGroup onChange={setValue} value={value}>
          <Stack direction="row">
            <Radio value="1" cursor="pointer" marginRight="16px">
              Proyecto
            </Radio>
            <Radio value="3" cursor="pointer">
              Sistema de ensayo
            </Radio>
          </Stack>
        </RadioGroup>
      </Card>
      <Grid templateColumns="1fr" gap="16px" width="fit-content" marginBottom="32px">
        <NotificationCard />
      </Grid>

      <Card width="50%">
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
          <AddSelect value={[]} onChange={()=>console.log("ha cambiado")} placeholder="Introduce tags" options={MOCK_SELECT_OPTIONS} />
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
      </Card>
    </Page>
  )
}

export default Index
