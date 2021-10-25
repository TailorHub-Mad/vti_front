import { Checkbox } from "@chakra-ui/checkbox"
import { Text } from "@chakra-ui/layout"
import { LinkItem } from "../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { Tag } from "../../components/tags/Tag/Tag"
import { TagRow } from "../../components/tags/TagRow/TagRow"
import { getPercentage } from "../functions/global"
import { variantGeneralTag } from "./tabs"

export const MAX_TABLE_WIDTH = 2400
export const MIN_TABLE_WIDTH = 800
export const TABLE_COMPONENTS = {
  text: <Text />,
  count: <Text />,
  link: <LinkItem />,
  selector: <Checkbox marginLeft="8px" colorScheme="blue" />,
  other: <Checkbox marginLeft="8px" colorScheme="blue" />,
  tags: <TagRow variant={variantGeneralTag.NOTE} />,
  tag: <Tag variant={variantGeneralTag.SYSTEM} />,
  options: <OptionsMenuRow />
}
export const TABLE_STYLE = {
  tableHeight: "calc(100vh - 190px)",
  p: "32px",
  pb: "0"
}

// Para el cálculo  del ancho: Todas las columnas deben sumar MIN_TABLE_WIDTH - [(nº columnas - 1) * 32]
export const calcColWidth = (width) => `${getPercentage(MIN_TABLE_WIDTH, width)}%`
