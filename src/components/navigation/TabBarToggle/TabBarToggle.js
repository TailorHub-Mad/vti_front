import { ChevronRightIcon, CloseIcon, Icon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react"
import React from "react"
import { MenuMobileIcon } from "../../icons/MenuMobileIcon"

export const TabBarToggle = ({ isOpen, onToggle }) => {
  return (
    <>
      <Box
        display={["none", null, null, "flex"]}
        flexDir="column"
        justifyContent="center"
        width="24px"
        height="100vh"
        position="fixed"
        top="0"
        left={!isOpen ? "0" : "176px"}
        transition={"left 0.15s ease-in-out"}
        cursor="pointer"
        onClick={onToggle}
        zIndex="991"
      >
        <Icon
          transform={`rotateZ(${isOpen ? "180" : "0"}deg)`}
          height="24px"
          color="white"
          bg="blue.500"
          width="24px"
        >
          <ChevronRightIcon />
        </Icon>
      </Box>
      <Box
        display={["block", null, null, "none"]}
        top={isOpen ? "24px" : "16px"}
        left="16px"
        height="33px"
        width="33px"
        zIndex="9990"
        position="fixed"
        onClick={onToggle}
        cursor="pointer"
      >
        {isOpen ? (
          <CloseIcon width="32px" color="white" />
        ) : (
          <MenuMobileIcon width="33px" color="white" />
        )}
      </Box>
    </>
  )
}
