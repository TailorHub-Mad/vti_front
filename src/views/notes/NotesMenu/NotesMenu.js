import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { NotesIcon } from '../../../components/icons/NotesIcon'

export const NotesMenu = ({notesCount = 0,...props}) => {
    return (
        <>
        <Flex {...props}>
          <Flex height="24px" align="center" cursor="pointer" marginRight="16px">
            <NotesIcon marginRight="4px" />
            <Text variant="d_s_medium" marginTop="4px">
              Todos
            </Text>
          </Flex>
          <Flex height="24px" align="center" cursor="pointer" marginRight="16px">
            <NotesIcon marginRight="4px" />
            <Text variant="d_s_medium" marginTop="4px">
              Activos
            </Text>
          </Flex>
          <Flex height="24px" align="center" cursor="pointer">
            <NotesIcon marginRight="4px" />
            <Text variant="d_s_medium" marginTop="4px">
              Favoritos
            </Text>
          </Flex>
        </Flex>
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${notesCount} Notas`}
        </Text>
        </>
    )
}
