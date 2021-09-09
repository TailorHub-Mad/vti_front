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
import useClientApi from "../../../../hooks/api/useClientApi"
import { ApiToastContext } from "../../../../provider/ToastProvider"
import { NewClientForm } from "../NewClientForm/NewClientForm"

export const NewClientModal = ({ isOpen, onClose, clientToEdit, ...props }) => {
  const [values, setValues] = useState([{}])
  const isEdit = clientToEdit
  const { showToast } = useContext(ApiToastContext)
  const { createClient } = useClientApi()
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
    const clientsQueue = values.map(async (val) => {
      return await createClient(val)
    })

    const resultsArr = await Promise.all(clientsQueue)
    //Meter toast de éxito
    showToast("CLiente añadido correctamente!")
    onClose()
    if (resultsArr.some((result) => result.error)) {
      console.log("ERROR")
      return
    }
  }

  useEffect(() => {
    const { name, alias, _id } = clientToEdit || {}
    setValues([{ name, alias, id: _id }])
  }, [clientToEdit])

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
            {isEdit ? "Editar cliente" : "Añadir nuevo cliente"}
          </Text>
          <CloseIcon width="24px" height="24px" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        {values.map((client, idx) => (
          <Box key={`client-${idx}`}>
            {idx !== 0 ? (
              <Text margin="32px 0" variant="d_l_medium">
                Añadir nuevo cliente
              </Text>
            ) : null}
            <NewClientForm
              value={client}
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
            Añadir nuevo cliente
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
