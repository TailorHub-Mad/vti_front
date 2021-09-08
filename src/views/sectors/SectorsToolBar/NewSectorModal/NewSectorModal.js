import {
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  ModalHeader,
  Button,
  Box,
} from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { CloseIcon } from "../../../../components/icons/CloseIcon"
import useSectorApi from "../../../../hooks/api/useSectorApi"
import { ApiToastContext } from "../../../../provider/ApiToastProvider"
import { NewSectorForm } from "../NewSectorForm/NewSectorForm"

export const NewSectorModal = ({ isOpen, onClose, sectorToEdit, ...props }) => {
  const [values, setValues] = useState([{}])
  const isEdit = sectorToEdit
  const { showToast } = useContext(ApiToastContext)
  const { createSector } = useSectorApi()
  const handleChange = (val, idx) => {
    const _values = [...values]
    _values[idx] = val
    setValues(_values)
  }
  const handleDelete = (idx) => {
    const _values = [...values]
    _values.splice(idx, 1)
    setValues(_values)
  }

  const checkInputs = () => {
    return values.some((val) => !val.name || !val.id || !val.alias)
  }

  const handleSubmit = async () => {
    const sectorsQueue = values.map(async (val) => {
      return await createSector(val)
    })

    // eslint-disable-next-line no-undef
    const resultsArr = await Promise.all(sectorsQueue)
    //Meter toast de éxito
    showToast("Sector añadido correctamente!")
    onClose()
    if (resultsArr.some((result) => result.error)) {
      console.log("ERROR")
      return
    }
  }

  useEffect(() => {
    const { name, alias, _id } = sectorToEdit || {}
    setValues([{ name, alias, id: _id }])
  }, [sectorToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <ModalHeader
          mb="32px"
          display="flex"
          p="0"
          justifyContent="space-between"
          w="100%"
        >
          <Text variant="d_l_medium">
            {isEdit ? "Editar sector" : "Añadir nuevo sector"}
          </Text>
          <CloseIcon width="24px" height="24px" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        {values.map((sector, idx) => (
          <Box key={`sector-${idx}`}>
            {idx !== 0 ? (
              <Text margin="32px 0" variant="d_l_medium">
                Añadir nuevo sector
              </Text>
            ) : null}
            <NewSectorForm
              value={sector}
              onChange={(val) => handleChange(val, idx)}
            />
            {idx !== 0 ? (
              <Button
                variant="text_only"
                color="error"
                onClick={() => handleDelete(idx)}
              >
                Eliminar
              </Button>
            ) : null}
          </Box>
        ))}
        <Button
          w="194px"
          margin="0 auto"
          mt="24px"
          disabled={checkInputs()}
          onClick={handleSubmit}
        >
          Guardar
        </Button>
        {!isEdit ? (
          <Button
            variant="text_only"
            onClick={() => setValues([...values, {}])}
            disabled={checkInputs()}
          >
            Añadir nuevo sector
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
