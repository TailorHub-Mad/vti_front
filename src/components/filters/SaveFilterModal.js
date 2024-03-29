import { Box, Button, Flex, Input, Switch, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import useFilterApi from "../../hooks/api/useFilterApi"
import { CustomModalHeader } from "../overlay/Modal/CustomModalHeader/CustomModalHeader"

const initialValues = {
  name: "",
  public: false
}

export const SaveFilterModal = ({
  filter,
  filterMetadata,
  type,
  isUpdateFilter,
  onClose,
  object,
  ...props
}) => {
  const { deleteFilter, updateFilter, createFilter } = useFilterApi()
  const [values, setValues] = useState(initialValues)
  const [errorCreate, setErrorCreate] = useState(false)

  const handleOnDelete = async () => {
    await deleteFilter(filterMetadata._id)
    onClose()
  }

  const handleOnSubmit = async () => {
    if (isUpdateFilter) {
      const newData = {
        name: filterMetadata.name,
        public: filterMetadata.public,
        type: filterMetadata.type,
        object: filterMetadata.object,
        ...values,
        query: filterMetadata.type === "complex" ? filter : JSON.stringify(filter)
      }

      await updateFilter(filterMetadata._id, newData)
      onClose()
    } else {
      const data = {
        name: values.name,
        type,
        object,
        query: type === "complex" ? filter : JSON.stringify(filter),
        public: values.public
      }

      const { error } = await createFilter(data)

      if (error) {
        setErrorCreate(true)
        setTimeout(() => {
          setErrorCreate(false)
        }, 3000)
      } else {
        setValues(initialValues)
        onClose()
      }
    }
  }

  useEffect(() => {
    if (!filter || !filterMetadata) return

    const { name, public: publicFilter } = filterMetadata
    setValues({ name, public: publicFilter })
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
        value={values.name}
        onChange={(e) =>
          setValues({
            ...values,
            name: e.target.value
          })
        }
      />
      <Switch
        isChecked={values.public}
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

      {errorCreate ? (
        <Flex justifyContent="center" mt="24px">
          <Text variant="d_s_regular" color="error">
            No puede haber dos filtros con el mismo nombre
          </Text>
        </Flex>
      ) : null}
    </Box>
  )
}
