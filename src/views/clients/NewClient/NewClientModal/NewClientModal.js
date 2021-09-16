import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useClientApi from "../../../../hooks/api/useClientApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { NewClientForm } from "../NewClientForm/NewClientForm"

export const NewClientModal = ({ isOpen, onClose, clientToUpdate, ...props }) => {
  const { showToast } = useContext(ToastContext)
  const { createClient, updateClient } = useClientApi()
  const { mutate, cache } = useSWRConfig()

  const [values, setValues] = useState([{}])
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
    return values.some(
      (value) =>
        // TODO -> autogenerate ID
        // !value.id ||
        !value.alias || !value.name
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const updatedClientsList = isUpdate
      ? await handleUpdateClient()
      : await handleCreateClient()

    updatedClientsList
      ? await mutate(SWR_CACHE_KEYS.clients, updatedClientsList, false)
      : await mutate(SWR_CACHE_KEYS.clients)

    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s sistema/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateClient = async () => {
    try {
      const clientsToCreate = [...values]
      await createClient(clientsToCreate)

      if (!cache.has(SWR_CACHE_KEYS.clients)) return null

      const cacheClients = cache.get(SWR_CACHE_KEYS.clients)
      const updatedClients = [...clientsToCreate, ...cacheClients]
      return updatedClients
    } catch (error) {
      // TODO -> manage errors
      console.log("ERROR")
    }
  }

  const handleUpdateClient = async () => {
    const { id } = clientToUpdate
    const [formatedClient] = [...values]

    const response = await updateClient(id, formatedClient)

    // TODO -> manage errors
    if (response?.error) {
      console.log("ERROR")
    }

    // TODO -> optimize cache request (update cache with updated client)
    return null
  }

  useEffect(() => {
    if (!clientToUpdate) return
    const { id, alias, name } = clientToUpdate
    setValues([{ alias, name, id }])
  }, [clientToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar cliente" : "Añadir nuevo cliente"}
          onClose={onClose}
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
