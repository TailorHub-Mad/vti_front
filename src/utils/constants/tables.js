import { Checkbox } from "@chakra-ui/checkbox"
import { Text } from "@chakra-ui/layout"
import { LinkItem } from "../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { TagRow } from "../../components/tags/TagRow/TagRow"
import { getPercentage } from "../functions/global"
import { variantGeneralTag } from "./tabs"

export const MAX_TABLE_WIDTH = 2400
export const MIN_TABLE_WIDTH = 1110
export const TABLE_COMPONENTS = {
  text: <Text />,
  count: <Text />,
  link: <LinkItem />,
  selector: <Checkbox marginLeft="8px" colorScheme="blue" />,
  tags: <TagRow variant={variantGeneralTag.NOTE} max={1} />,
  options: <OptionsMenuRow />
}
export const TABLE_STYLE = {
  tableHeight: "calc(100vh - 190px)",
  p: "32px",
  pb: "0"
}

export const calcColWidth = (width) => `${getPercentage(MIN_TABLE_WIDTH, width)}%`
