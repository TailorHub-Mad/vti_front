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
import { CloseIcon } from "../../../../../components/icons/CloseIcon"
import useSystemApi from "../../../../../hooks/api/useSystemsApi"
import { ApiToastContext } from "../../../../../provider/ApiToastProvider"
import { NewTestSystemForm } from "../NewTestSystemForm/NewTestSystemForm"

export const NewTestSystemModal = ({ isOpen, onClose, systemToEdit, ...props }) => {
  const { showToast } = useContext(ApiToastContext)
  const { createSystem } = useSystemApi()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = Boolean(systemToEdit)

  const handleChange = (val, idx) => {
    const _values = [...values]
    _values[idx] = val
    setValues(_values)
  }

  const handleDelete = (index) => {
    const _values = [...values]
    _values.splice(index, 1)
    setValues(_values)
  }

  const checkInputsAreEmpty = () => {
    return values.some(
      (value) =>
        !value.id || !value.vtiCode || !value.client || !value.alias || !value.year
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const systemsQueue = values.map(async (value) => createSystem(value))
    // TODO -> manage errors
    await Promise.all(systemsQueue)

    showToast("¡Has añadido nuevo/s ensayo/s!")
    setIsSubmitting(false)
    onClose()
  }

  useEffect(() => {
    if (!systemToEdit) return

    const {
      _id,
      vtiCode,
      clientAlias,
      alias,
      date: { year },
    } = systemToEdit || {}
    setValues([{ vtiCode, clientAlias, alias, year, id: _id }])
  }, [systemToEdit])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

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
            {isEdit ? "Editar sistema" : "Añadir nuevo sistema"}
          </Text>
          <CloseIcon width="24px" height="24px" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        {values.map((system, index) => (
          <Box key={`system-${index}`}>
            {index !== 0 && (
              <Text margin="32px 0" variant="d_l_medium">
                Añadir nuevo sistema
              </Text>
            )}

            <NewTestSystemForm
              value={system}
              onChange={(value) => handleChange(value, index)}
            />

            {index !== 0 && (
              <Button
                variant="text_only"
                color="error"
                onClick={() => handleDelete(index)}
              >
                Eliminar
              </Button>
            )}
          </Box>
        ))}
        <Button
          w="194px"
          margin="0 auto"
          mt="24px"
          disabled={checkInputsAreEmpty()}
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          Guardar
        </Button>

        {isEdit || (
          <Button
            variant="text_only"
            onClick={() => setValues([...values, {}])}
            disabled={checkInputsAreEmpty()}
          >
            Añadir nuevo sistema
          </Button>
        )}
      </ModalContent>
    </Modal>
  )
}
