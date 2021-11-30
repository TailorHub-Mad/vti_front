import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons"
import { Grid, Flex, Box } from "@chakra-ui/layout"
import { Text, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { fetchType } from "../../../utils/constants/swr"
import { groupTable } from "../../../views/notes/NotesGroup/utils"
import { TableCard } from "../../cards/TableCard/TableCard"

export const TableGrid = ({
  items,
  fetchState = fetchType.ALL,
  onFilter,
  onGroup,
  groupOption,
  onSubscribe,
  onFavorite,
  type
}) => {
  const formatItems = fetchState === fetchType.GROUP && groupTable(items)

  return (
    <>
      {fetchState === fetchType.FILTER ? (
        <Flex
          alignItems="center"
          onClick={() => onFilter(null)}
          cursor="pointer"
          mb="24px"
        >
          <CloseIcon mr="8px" h="12px" />
          <Text marginTop="6px">{`Eliminar filtro`}</Text>
        </Flex>
      ) : null}

      {fetchState === fetchType.GROUP ? (
        <Flex
          alignItems="center"
          onClick={() => onFilter(null)}
          cursor="pointer"
          mb="24px"
        >
          <CloseIcon
            mr="8px"
            h="12px"
            cursor="pointer"
            onClick={() => onGroup(null)}
          />
          <Text marginTop="3px" cursor="pointer">{`Agrupado por ${groupOption
            .toString()
            .toUpperCase()}`}</Text>
        </Flex>
      ) : null}

      <Flex w="100%" justifyContent="flex-end" mb="8px" mt="8px">
        <Text mr="16px" color="grey">{`${
          fetchState === fetchType.GROUP
            ? formatItems.reduce((acc, val) => {
                return acc + val.value.length
              }, 0)
            : items?.length
        } ${type === "projects" ? "proyectos" : "sistemas"}`}</Text>
      </Flex>

      {fetchState === fetchType.GROUP ? (
        formatItems?.map((item) => {
          const { isOpen, onToggle } = useDisclosure()

          return (
            <>
              <Box pb={isOpen ? "20px" : "10px"}>
                <Flex
                  onClick={onToggle}
                  cursor="pointer"
                  align="center"
                  padding="10px 0"
                >
                  <Text variant="d_s_medium">{item.key}</Text>
                  <ChevronDownIcon transform={isOpen ? "rotate(180deg)" : "none"} />
                </Flex>
                {isOpen ? (
                  <Grid
                    templateColumns={[
                      "auto",
                      null,
                      null,
                      "repeat(auto-fill, 282px)"
                    ]}
                    gap="16px"
                    width="100%"
                    marginBottom="24px"
                    alignItems="center"
                  >
                    {item.value?.map((item, idx) => (
                      <TableCard
                        key={`${item._id}-${idx}`}
                        item={item}
                        onSubscribe={onSubscribe}
                        onFavorite={onFavorite}
                        type={type}
                      />
                    ))}
                  </Grid>
                ) : null}
              </Box>
            </>
          )
        })
      ) : (
        <Grid
          templateColumns={["auto", null, null, "repeat(auto-fill, 282px)"]}
          gap="16px"
          width="100%"
          marginBottom="24px"
          alignItems="center"
        >
          {items?.map((item, idx) => (
            <TableCard
              key={`${item._id}-${idx}`}
              item={item}
              onSubscribe={onSubscribe}
              onFavorite={onFavorite}
              type={type}
            />
          ))}
        </Grid>
      )}
    </>
  )
}
