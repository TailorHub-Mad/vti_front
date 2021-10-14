import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useSectorApi from "../../../../hooks/api/useSectorApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewSectorForm } from "../NewSectorForm/NewSectorForm"

const initialValues = [{}]

export const NewSectorModal = ({ isOpen, onClose, sectorToUpdate, ...props }) => {
  const { showToast } = useContext(ToastContext)
  const { createSector, updateSector } = useSectorApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(sectorToUpdate)

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
    return values.some((value) => !value.title)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateSector() : await handleCreateSector()
    setValues(initialValues)
    await mutate(SWR_CACHE_KEYS.sectors)
    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s sector/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateSector = async () => {
    try {
      const sectorsToCreate = [...values]
      await createSector(sectorsToCreate)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateSector = async () => {
    try {
      const { _id } = sectorToUpdate
      const [data] = [...values]
      await updateSector(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues(initialValues)
    onClose()
  }

  useEffect(() => {
    if (!sectorToUpdate) return
    const { title } = sectorToUpdate
    setValues([{ title }])
  }, [sectorToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar sector" : "Añadir nuevo sector"}
          onClose={handleOnClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          addTitle="Añadir nuevo sector"
        >
          <NewSectorForm />
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
            Añadir nuevo sector
          </Button>
        )}
      </ModalContent>
    </Modal>
  )
}
