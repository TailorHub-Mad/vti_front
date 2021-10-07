import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Text
} from "@chakra-ui/react"
import React from "react"
import { ChevronDownIcon } from "../../../../icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../../../icons/ChevronUpIcon"

export const NoteAccordionItem = ({ title, icon, children, ...props }) => {
  return (
    <AccordionItem border="0px" bg="transparent" {...props}>
      {({ isExpanded }) => (
        <>
          <AccordionButton
            _hover={{ background: "none", outline: "none" }}
            _focus={{ outline: "none" }}
            p="0"
            pt="8px"
            mt="24px"
          >
            <Flex align="center">
              <Flex align="center">
                {React.cloneElement(icon, { mr: "8px" })}
                <Text variant="d_s_medium" mt="4px">
                  {title}
                </Text>
              </Flex>
              {isExpanded ? (
                <ChevronUpIcon ml="2px" />
              ) : (
                <ChevronDownIcon ml="2px" />
              )}
            </Flex>
          </AccordionButton>
          <AccordionPanel pl={"32px"}>{children}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}
