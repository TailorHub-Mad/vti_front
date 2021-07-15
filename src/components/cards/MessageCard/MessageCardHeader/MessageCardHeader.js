import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Flex, Text, useOutsideClick } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { HeartIcon } from "../../../icons/HeartIcon"
import { OptionsIcon } from "../../../icons/OptionsIcon"

const icons_props = {
  width: "16px",
  height: "16px",
  cursor: "pointer",
}
export const MessageCardHeader = ({isFavourite , title, ...props}) => {
  const [showOptions, setShowOptions] = useState(false)
  const ref = useRef(null)
  useOutsideClick({
    ref: ref,
    handler: () => setShowOptions(false),
  })
  return (
    <Flex height="32px" justify="space-between" {...props}>
      <Flex maxWidth="80%" height="32px">
        {isFavourite ? (
          <HeartIcon color="error" {...icons_props} marginRight="4px" />
        ) : null}
        <Text marginTop="2px" variant="d_s_medium" noOfLines={2}>
          {title}
        </Text>
      </Flex>
      <Box position="relative">
        <OptionsIcon
          {...icons_props}
          color="grey"
          onClick={() => setShowOptions(true)}
        />
        {showOptions ? (
          <Box
            position="absolute"
            top="-22px"
            right="24px"
            bgColor="white"
            ref={ref}
            borderRadius="2px"
            boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
            width="94px"
            height="64px"
          >
            <Flex
              align="center"
              width="100%"
              height="32px"
              borderBottom="1px solid"
              borderColor="blue"
              cursor="pointer"
              padding="8px"
              _hover={{
                opacity: "0.8",
              }}
            >
              <HeartIcon
                {...icons_props}
                marginRight="4px"
                color="blue"
                onClick={() => setShowOptions(true)}
              />
              <Text variant="d_xs_regular" marginRight="2px">
                Favorito
              </Text>
            </Flex>
            <Flex
              align="center"
              width="100%"
              height="32px"
              borderColor="blue"
              cursor="pointer"
              padding="8px"
              _hover={{
                opacity: "0.8",
              }}
            >
              <DeleteIcon
                {...icons_props}
                marginRight="4px"
                color="error"
                onClick={() => setShowOptions(true)}
              />
              <Text variant="d_xs_regular" color="error" marginRight="2px">
                Eliminar
              </Text>
            </Flex>
          </Box>
        ) : null}
      </Box>
    </Flex>
  )
}
