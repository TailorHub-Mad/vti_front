import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useClientApi from "../../../../hooks/api/useClientApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewClientForm } from "../NewClientForm/NewClientForm"

const initialValues = [{}]

export const NewClientModal = ({ isOpen, onClose, clientToUpdate }) => {
  const { showToast } = useContext(ToastContext)
  const { createClient, updateClient } = useClientApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(clientToUpdate)

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
    return values.some((value) => !value.alias || !value.name)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateClient() : await handleCreateClient()
    setValues(initialValues)
    await mutate(SWR_CACHE_KEYS.clients)
    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s cliente/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateClient = async () => {
    try {
      const clientsToCreate = [...values]

      for (let index = 0; index < clientsToCreate.length; index++) {
        await createClient([clientsToCreate[index]])
      }
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateClient = async () => {
    try {
      const { _id } = clientToUpdate
      const [data] = [...values]
      await updateClient(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues(initialValues)
    onClose()
  }

  useEffect(() => {
    if (!clientToUpdate) return
    const { alias, name } = clientToUpdate
    setValues([{ alias, name }])
  }, [clientToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar cliente" : "Añadir nuevo cliente"}
          onClose={handleOnClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          addTitle="Añadir nuevo cliente"
        >
          <NewClientForm />
        </MultipleFormContent>
        <Button
          w="194px"
          margin="0 auto"
          mt="24px"
          disabled={checkInputsAreEmpty()}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          pointerEvents={isSubmitting ? "none" : "all"}
        >
          Guardar
        </Button>

        {!isUpdate ? (
          <Button
            variant="text_only"
            onClick={() => setValues([...values, {}])}
            disabled={checkInputsAreEmpty()}
          >
            Añadir nuevo cliente
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
