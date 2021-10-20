import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useAuthApi from "../../../../hooks/api/useAuthApi"
import useUserApi from "../../../../hooks/api/useUserApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewUserForm } from "../NewUserForm/NewUserForm"

const initialValues = [{}]

export const NewUserModal = ({ isOpen, onClose, userToUpdate }) => {
  const { showToast } = useContext(ToastContext)
  const { createUser, updateUser } = useUserApi()
  const { sendCreatePassword } = useAuthApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
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
      (value) => !value.alias || !value.name || !value.email || !value.department
    )
  }

  const formatCreateUsers = (users) => {
    return users.map((user) => {
      return {
        alias: user.alias,
        name: user.name,
        email: user.email,
        department: user.department.value,
        password: Math.random().toString(8) // TODO -> provisional
      }
    })
  }

  const formatUpdateUsers = (users) => {
    return users.map((user) => {
      return {
        alias: user.alias,
        name: user.name,
        department: user.department.value
      }
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateUser() : await handleCreateUser()
    setValues(initialValues)
    await mutate(SWR_CACHE_KEYS.users)
    showToast(
      isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s usuario/s!",
      "boy"
    )
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateUser = async () => {
    try {
      const usersToCreate = formatCreateUsers(values)
      for (let index = 0; index < usersToCreate.length; index++) {
        await createUser(usersToCreate[index])
      }

      const sendEmailQueue = usersToCreate.map((u) =>
        sendCreatePassword({ email: u.email })
      )
      await Promise.all(sendEmailQueue)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateUser = async () => {
    try {
      const { _id } = userToUpdate
      const [data] = formatUpdateUsers(values)
      await updateUser(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues(initialValues)
    onClose()
  }

  useEffect(() => {
    if (!userToUpdate) return
    const { alias, name, email, department } = userToUpdate
    setValues([{ alias, name, email, department: department?.name }])
  }, [userToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar usuario" : "Añadir nuevo usuario"}
          onClose={handleOnClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          objectToUpdate={userToUpdate}
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
