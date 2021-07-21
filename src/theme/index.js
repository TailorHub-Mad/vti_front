import { extendTheme } from "@chakra-ui/react"
import { Text } from "./components/text.theme"
import { Input } from "./components/input.theme"
import { Button } from "./components/button.theme"
import { Switch } from "./components/switch.theme"
import { Checkbox } from "./components/checkbox.theme"
import { Icon } from "./components/icon.theme"
import { Tag } from "./components/tag.theme"
import { IconButton } from "./components/icon_button.theme"
import { breakpoints } from "./fundations/breakpoints.theme"
import { textStyles } from "./fundations/textStyles.theme"
import { colors } from "./fundations/colors.theme"
import { icons } from "./fundations/icons.theme"

const theme = extendTheme({
  colors,
  fonts: {
    heading: "Noway-Medium",
    body: "Noway-Regular",
  },
  textStyles,
  breakpoints,
  components: {
    Text,
    Tag,
    Input,
    Button,
    IconButton,
    Icon,
    Checkbox,
    Switch
  },
  icons,
})

export default theme
