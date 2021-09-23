import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useNoteApi from "../../../../hooks/api/useNoteApi"
// import useNoteApi from "../../../../hooks/api/useNoteApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewNoteForm } from "../NewNoteForm/NewNoteForm"

const initialValues = {
  project: undefined,
  system: undefined,
  title: undefined,
  description: undefined,
  link: undefined,
  docuement: undefined
  // tags: [""], // provisioanl
}

export const NewNoteModal = ({ isOpen, onClose, noteToUpdate, ...props }) => {
  const { showToast } = useContext(ToastContext)
  const { createNote } = useNoteApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(noteToUpdate)

  const checkInputsAreEmpty = () => {
    return (
      !values.project || !values.system || !values.title || !values.description
      // || !value.tags // TODO -> provisional
    )
  }

  const formatCreateNote = (note) => {
    const formatData = {
      project: note.project.value,
      testSystems: note.system.map((s) => s.value),
      title: note.title,
      description: note.description,
      tags: ["60e71fb6b872c54560f16820"] // TODO -> provisional
    }

    if (note?.link) formatData["link"] = note.link

    return formatData
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateNote() : await handleCreateNote()
    await mutate(SWR_CACHE_KEYS.projects)
    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s apunte/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateNote = async () => {
    try {
      const note = formatCreateNote(values)
      console.log("NOTE QUE LLEGA", note)
      await createNote(note)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateNote = async () => {
    return null
  }

  useEffect(() => {
    if (!noteToUpdate) return
    const _note = {
      project: noteToUpdate.project,
      system: noteToUpdate.system,
      title: noteToUpdate.title,
      description: noteToUpdate.description,
      link: noteToUpdate.link,
      attachment: noteToUpdate.attachment
    }
    setValues(_note)
  }, [noteToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues(initialValues)
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
        <NewNoteForm
          value={values}
          onChange={(val) => setValues(val)}
          noteToUpdate={noteToUpdate}
        />
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
      </ModalContent>
    </Modal>
  )
}
