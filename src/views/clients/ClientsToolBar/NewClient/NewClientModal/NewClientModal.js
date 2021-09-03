import {
  ScaleFade,
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Button,
  Box,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { CloseIcon } from "../../../../../components/icons/CloseIcon"
import { Popup } from "../../../../../components/overlay/Popup/Popup"
import useClientsApi from "../../../../../hooks/api/useClientsApi"
import { useShowToast } from "../../../../../hooks/useShowToast"
import { NewClientForm } from "../NewClientForm/NewClientForm"

export const NewClientModal = ({
  isOpen,
  onClose,
  color,
  title,
  childen,
  ...props
}) => {
  const [values, setValues] = useState([{}])
  const { createClient } = useClientsApi()
  const { showToast, isToastOpen } = useShowToast()
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
    showToast()
    if (resultsArr.some((result) => result.error)) {
      console.log("ERROR")
      return
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <Popup isOpen={isToastOpen} variant="info">
        Clientes creados correctamente!
      </Popup>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <ModalHeader
          mb="32px"
          display="flex"
          p="0"
          justifyContent="space-between"
          w="100%"
        >
          <Text variant="d_l_medium"> Añadir nuevo cliente</Text>
          <CloseIcon width="24px" height="24px" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        {values.map((clientsToAdd, idx) => (
          <Box key={`client-${idx}`}>
            {idx !== 0 ? (
              <Text margin="32px 0" variant="d_l_medium">
                Añadir nuevo cliente
              </Text>
            ) : null}
            <NewClientForm
              value={clientsToAdd}
              onChange={(val) => handleChange(val, idx)}
            />
            <Button
              variant="text_only"
              color="error"
              onClick={() => handleDelete(idx)}
            >
              Eliminar
            </Button>
          </Box>
        ))}
        <Button
          w="194px"
          margin="0 auto"
          disabled={checkInputs()}
          onClick={handleSubmit}
        >
          Guardar
        </Button>
        <Button
          variant="text_only"
          onClick={() => setValues([...values, {}])}
          disabled={checkInputs()}
        >
          Añadir nuevo cliente
        </Button>
      </ModalContent>
    </Modal>
  )
}
