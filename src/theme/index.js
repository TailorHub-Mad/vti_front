import { extendTheme } from "@chakra-ui/react"
import { Text } from "./components/text.theme"
import { Input } from "./components/input.theme"
import { Textarea } from "./components/textarea.theme"
import { Button } from "./components/button.theme"
import { Switch } from "./components/switch.theme"
import { Checkbox } from "./components/checkbox.theme"
import { Icon } from "./components/icon.theme"
import { Tag } from "./components/tag.theme"
import { Modal } from "./components/modal.theme"
import { IconButton } from "./components/icon_button.theme"
import { breakpoints } from "./fundations/breakpoints.theme"
import { textStyles } from "./fundations/textStyles.theme"
import { colors } from "./fundations/colors.theme"
import { FormLabel } from "./components/formLabel.theme"
import { icons } from "./fundations/icons.theme"

const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  colors,
  fonts: {
    heading: "Noway-Medium",
    body: "Noway-Regular"
  },
  textStyles,
  breakpoints,
  components: {
    Text,
    Tag,
    Input,
    Textarea,
    Button,
    IconButton,
    Icon,
    Checkbox,
    Switch,
    FormLabel,
    Modal
  },
  icons
})

export default theme
