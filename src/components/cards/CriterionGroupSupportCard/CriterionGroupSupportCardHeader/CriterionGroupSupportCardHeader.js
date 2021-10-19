import { Box, Flex, Text } from "@chakra-ui/react"

export const CriterionGroupSupportCardHeader = ({ title, onClick, ...props }) => {
  return (
    <Flex height="32px" justify="space-between" {...props}>
      <Box maxWidth="80%" height="32px" onClick={onClick} cursor="pointer">
        <Text marginTop="2px" variant="d_m_medium">
          {title}
        </Text>
      </Box>
    </Flex>
  )
}
