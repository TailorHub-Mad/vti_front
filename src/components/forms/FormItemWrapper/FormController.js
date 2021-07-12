import { Box, FormControl, FormErrorMessage, FormLabel, Text } from '@chakra-ui/react'
import React from 'react'

export const FormController = ({label, error, children,...props}) => {
    //TODO helper y ventna de apoyo
    return (
        <FormControl {...props}>
            {label ? <FormLabel>{label}</FormLabel> : null}
            {children}
            {error ? <Text color="red" marginTop={["2px","0"]} variant="d_xs_regular">{error}</Text> : null}
        </FormControl>
    )
}
