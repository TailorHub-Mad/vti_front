import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import React from "react"
import { HelpDarkIcon } from "../../icons/HelpDarkIcon"

export const FormController = ({ label, error, helper, children, onHelperClick, ...props }) => {
  //TODO helper y ventna de apoyo
  return (
    <FormControl {...props}>
      {label ? (
        <Box display="flex" alignItems="center">
          <FormLabel margin="0" marginRight="4px" display="flex" alignItems="center">
            {label}
          </FormLabel>
          {helper && (
            <Tooltip hasArrow label={helper} bg="blue" borderRadius="2px" padding="8px" placement="top">
              <span>
                <HelpDarkIcon
                  width="24px"
                  height="24px"
                  marginBottom="4px"
                  cursor="pointer"
                  onClick={()=> onHelperClick && onHelperClick()}
                />
              </span>
            </Tooltip>
          )}
        </Box>
      ) : null}
      {children}
      {error ? (
        <Text color="red" marginTop={["2px", "0"]} variant="d_xs_regular">
          {error}
        </Text>
      ) : null}
    </FormControl>
  )
}
