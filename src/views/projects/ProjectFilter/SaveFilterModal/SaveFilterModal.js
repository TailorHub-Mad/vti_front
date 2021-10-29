import { Box, Button, Flex, Input, Switch, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useFilterApi from "../../../../hooks/api/useFilterApi"

const initialValues = {
  name: "",
  public: false
}

export const SaveFilterModal = ({
  filter,
  filterId,
  type,
  isUpdateFilter,
  onClose,
  ...props
}) => {
  const { deleteFilter, updateFilter, createFilter } = useFilterApi()

  const [values, setValues] = useState(initialValues)

  const handleOnDelete = async () => {
    await deleteFilter(filterId)
  }

  const handleOnSubmit = async () => {
    const data = {
      name: values.name,
      type,
      query: JSON.stringify(filter),
      public: values.public
    }

    if (isUpdateFilter) {
      await updateFilter()
    } else {
      await createFilter(data)
    }

    onClose()
  }

  useEffect(() => {
    if (!filter) return
  }, [isUpdateFilter])

  return (
    <Box
      width="460px"
      height="fit-content"
      position="fixed"
      top="calc(50vh - 300px)"
      left={"calc(50vw - 230px)"}
      transition="left 0.18s ease-in-out"
      bgColor="white"
      zIndex="1400"
      padding="32px"
      {...props}
    >
      <CustomModalHeader title="Guardar filtro" onClose={onClose} pb="24px" />
      <Text variant="d_s_medium" mb="2px">
        Escriba o seleccione una combinación
      </Text>
      <Input
        placeholder="Filtro 1"
        mb="24px"
        onChange={(e) =>
          setValues({
            ...values,
            name: e.target.value
          })
        }
      />
      <Switch
        onChange={(e) =>
          setValues({
            ...values,
            public: e.target.checked
          })
        }
      >
        Quiero que el filtro sea público
      </Switch>
      <Flex justifyContent="space-between" mt="24px">
        <Button
          variant="secondary"
          color="error"
          borderColor="error"
          onClick={handleOnDelete}
          isDisabled={!isUpdateFilter}
        >
          Eliminar
        </Button>
        <Button onClick={handleOnSubmit} isDisabled={!values.name}>
          {isUpdateFilter ? "Editar" : "Guardar"}
        </Button>
      </Flex>
    </Box>
  )
}
