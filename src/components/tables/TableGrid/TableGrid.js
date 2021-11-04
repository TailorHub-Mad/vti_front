import { CloseIcon } from "@chakra-ui/icons"
import { Grid, Flex } from "@chakra-ui/layout"
import { Text } from "@chakra-ui/react"
import React, { useContext, useMemo } from "react"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { fetchType } from "../../../utils/constants/swr"
import { TableCard } from "../../cards/TableCard/TableCard"

export const TableGrid = ({
  items,
  onDelete,
  // onClose,
  onDeleteMany,
  // onEdit,
  fetchState = fetchType.ALL,
  onGroup,
  onFilter,
  groupOption,
  // handleSortElement,
  // onSubscribe,
  // onFavorite,
  selectedRows,
  setSelectedRows,
  // handleRowSelect,
  handleSelectAllRows
}) => {
  const { role } = useContext(ApiAuthContext)

  const isGrouped = fetchState === fetchType.GROUP

  // const selectedRowsKeys = selectedRows && Object.keys(selectedRows)

  useMemo(() => {
    setSelectedRows && setSelectedRows([])
  }, [items?.length])

  const handleOnDelete = () => {
    const projectsId = Object.keys(selectedRows)
    if (Object.keys(selectedRows).length > 1) return onDeleteMany(projectsId)

    return isGrouped ? onDelete(selectedRows) : onDelete(projectsId[0])
  }

  // const projectsData = formatProject(items, fetchState)

  // const allRowsAreSelected =
  //   projectsData?.length > 0 && selectedRowsKeys?.length === projectsData?.length

  return (
    <>
      {fetchState === fetchType.FILTER && items?.length > 0 ? (
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
            projectsCount={0}
            selectedRows={selectedRows}
            onDelete={handleOnDelete}
            selectAllRows={() => handleSelectAllRows(/*projectsData*/)}
            checked={false}
            fetchState={fetchState}
            onGroup={onGroup}
            onFilter={onFilter}
            groupOption={groupOption}
            role={role}
          />
        ))}
      </Grid>
    </>
  )
}
