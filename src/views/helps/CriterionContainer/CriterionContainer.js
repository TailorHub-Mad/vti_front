import React from "react"
import { Flex, Box, Grid, Text } from "@chakra-ui/react"
import { CriterionTitleCard } from "../../../components/cards/CriterionTitleCard/Criterion"

export const CriterionContainer = ({ criterion, ...props }) => {
  console.log("DENTRO", criterion)
  return (
    <Box>
      <Flex width="100%" alignItems="center" {...props}>
        <Text variant="d_m_medium">{criterion.title}</Text>
      </Flex>

      <Grid
        templateColumns="repeat(auto-fill, 266px)"
        gap="16px"
        width="100%"
        mt="8px"
        mb="24px"
      >
        {criterion.group.map((group) => (
          <CriterionTitleCard
            help={group}
            // onAdd={() => setIsHelpModalOpen(true)}
            // onEdit={() => handleUpdate(group._id)}
            // onDelete={() => setHelpToDelete(group._id)}
            key={group.title}
          />
        ))}
      </Grid>
    </Box>
  )
}
