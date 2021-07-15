import { Flex, Icon, Text } from "@chakra-ui/react"
import { useState } from "react"

export const MenuItem = ({ label, icon, submenu, ...props }) => {
  //TODO link, detectar active y submenu
  const [showSubmenu, setShowSubmenu] = useState(false)

  return (
    <Flex
      align="center"
      padding="8px 0"
      {...props}
      marginBottom="16px"
      role="group"
      _hover={{
        cursor: "pointer",
      }}
      pointerEvents={props.isDisabled ? "none" : "auto"}
      opacity={props.isDisabled ? "0.3" : "1"}
    >
      <Icon color="white" marginRight="8px" _groupHover={{ color: "yellow" }}>
        {icon}
      </Icon>
      <Text
        color="white"
        variant="d_s_medium"
        _groupHover={{ color: "yellow" }}
        marginTop="3px"
      >
        {label}
      </Text>
    </Flex>
  )
}
