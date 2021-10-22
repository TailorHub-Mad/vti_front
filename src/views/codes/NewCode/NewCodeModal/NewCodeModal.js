import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useCodeApi from "../../../../hooks/api/useCodeApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewCodeForm } from "../NewCodeForm/NewCodeForm"

const initialValues = [{}]

export const NewCodeModal = ({ isOpen, onClose, codeToUpdate, ...props }) => {
  const { showToast } = useContext(ToastContext)
  const { createCode, updateCode } = useCodeApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(codeToUpdate)

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
    return values.some((value) => !value.name)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateCode() : await handleCreateCode()
    setValues(initialValues)
    await mutate(SWR_CACHE_KEYS.codes)
    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s códigos/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateCode = async () => {
    try {
      const codesToCreate = [...values]

      for (let index = 0; index < codesToCreate.length; index++) {
        await createCode(codesToCreate[index])
      }
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateCode = async () => {
    try {
      const { _id } = codeToUpdate
      const [data] = [...values]
      await updateCode(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues(initialValues)
    onClose()
  }

  useEffect(() => {
    if (!codeToUpdate) return
    const { name } = codeToUpdate
    setValues([{ name }])
  }, [codeToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar código" : "Añadir nuevo código"}
          onClose={handleOnClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          addTitle="Añadir nuevo código"
        >
          <NewCodeForm />
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

        {isUpdate || (
          <Button
            variant="text_only"
            onClick={() => setValues([...values, {}])}
            disabled={checkInputsAreEmpty()}
          >
            Añadir nuevo código
          </Button>
        )}
      </ModalContent>
    </Modal>
  )
}
