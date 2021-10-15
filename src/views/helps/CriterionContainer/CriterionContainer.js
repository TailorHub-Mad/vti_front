import React from "react"
import { Flex, Box, Grid, Text } from "@chakra-ui/react"
import { CriterionCard } from "../../../components/cards/CriterionCard/Criterion"
import { ChevronDuoUpIcon } from "../../../components/icons/ChevronDuoUpIcon"
import { ChevronDuoDownIcon } from "../../../components/icons/ChevronDuoDownIcon"
import { NewCriterionGroupCard } from "../NewCriterionGroupCard/NewCriterionGroupCard"

export const CriterionContainer = ({ criterion, createCriterion, ...props }) => {
  console.log("DENTRO", criterion)

  return (
    <Box>
      <Flex width="100%" alignItems="center" {...props}>
        <Text variant="d_m_medium" mr="2px">
          {criterion.title}
        </Text>
        <ChevronDuoUpIcon mb="4px" />
        <ChevronDuoDownIcon mb="4px" />
      </Flex>

      <Grid
        templateColumns="repeat(auto-fill, 266px)"
        gap="16px"
        width="100%"
        mt="8px"
        mb="24px"
      >
        <NewCriterionGroupCard createCriterion={createCriterion} />
        {criterion.group.map((group) => (
          <CriterionCard
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
