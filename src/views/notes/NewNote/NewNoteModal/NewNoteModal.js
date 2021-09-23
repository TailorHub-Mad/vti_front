import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
// import useNoteApi from "../../../../hooks/api/useNoteApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { NewNoteForm } from "../NewNoteForm/NewNoteForm"

export const NewNoteModal = ({ isOpen, onClose, noteToUpdate, ...props }) => {
  const { showToast } = useContext(ToastContext)
  // const { createNote, updateNote } = useNoteApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(noteToUpdate)

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

    const updatedNotesList = isUpdate
      ? await handleUpdateNote()
      : await handleCreateNote()

    updatedNotesList
      ? await mutate(SWR_CACHE_KEYS.notes, updatedNotesList, false)
      : await mutate(SWR_CACHE_KEYS.notes)

    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s sistema/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateNote = async () => {
    return null
  }

  const handleUpdateNote = async () => {
    return null
  }

  useEffect(() => {
    if (!noteToUpdate) return
    const { id, alias, name } = noteToUpdate
    setValues([{ alias, name, id }])
  }, [noteToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar apunte" : "Añadir nuevo apunte"}
          onClose={onClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          addTitle="Añadir nuevo apunte"
        >
          <NewNoteForm />
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
            Añadir nuevo apunte
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
