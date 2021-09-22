import { Checkbox } from "@chakra-ui/checkbox"
import { Text } from "@chakra-ui/layout"
import { LinkItem } from "../../components/navigation/LinkItem/LinkItem"
import { OptionsMenuRow } from "../../components/navigation/OptionsMenu/OptionsMenuRow/OptionsMenuRow"
import { TagGroup } from "../../components/tags/TagGroup/TagGroup"
import { getPercentage } from "../functions/common"
import { MIN_TABLE_WIDTH } from "./layout"

export const tableComponentsType = {}

export const TABLE_COMPONENTS = {
  text: <Text />,
  mapText: <Text />,
  count: <Text />,
  link: <LinkItem />,
  selector: <Checkbox marginLeft="8px" colorScheme="blue" />,
  tags: <TagGroup variant="light_blue" max={3} />,
  options: <OptionsMenuRow />
}

export const calcColWidth = (width) => `${getPercentage(MIN_TABLE_WIDTH, width)}%`
