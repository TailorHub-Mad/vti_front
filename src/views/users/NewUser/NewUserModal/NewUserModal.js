import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useUserApi from "../../../../hooks/api/useUserApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewUserForm } from "../NewUserForm/NewUserForm"

export const NewUserModal = ({ isOpen, onClose, userToUpdate }) => {
  const { showToast } = useContext(ToastContext)
  const { createUser, updateUser } = useUserApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(userToUpdate)

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
        !value.alias ||
        !value.fullName ||
        !value.email ||
        !value.department ||
        !value.fullName
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateUser() : await handleCreateUser()
    await mutate(SWR_CACHE_KEYS.users)
    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s usuario/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateUser = async () => {
    try {
      const usersToCreate = [...values]
      await createUser(usersToCreate)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateUser = async () => {
    try {
      const { _id } = userToUpdate
      const [data] = [...values]
      await updateUser(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  useEffect(() => {
    if (!userToUpdate) return
    const { alias, name } = userToUpdate
    setValues([{ alias, name }])
  }, [userToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar usuario" : "Añadir nuevo usuario"}
          onClose={onClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          addTitle="Añadir nuevo usuario"
        >
          <NewUserForm />
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
            Añadir nuevo usuario
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
