import { Button, Flex, Center } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import useNoteApi from "../../hooks/api/useNoteApi"
import { ToastContext } from "../../provider/ToastProvider"
import { errorHandler } from "../../utils/errors"
import { NewNoteForm } from "../../views/notes/NewNote/NewNoteForm/NewNoteForm"

const initialValues = {
  project: undefined,
  system: undefined,
  title: undefined,
  description: undefined,
  tags: undefined,
  link: undefined,
  document: undefined
}

const nuevo = () => {
  const { showToast } = useContext(ToastContext)
  const { createNote } = useNoteApi()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkInputsAreEmpty = () => {
    return (
      !values.project ||
      !values.system ||
      !values.title ||
      !values.description ||
      !values.tags
    )
  }

  const submitIsDisabled = checkInputsAreEmpty()

  const formatCreateNote = (note) => {
    const formatData = {
      project: note.project.value,
      testSystems: note.system.map((s) => s.value),
      title: note.title,
      description: note.description,
      tags: note.tags.map((t) => t.value)
    }

    if (note?.link) formatData["link"] = note.link
    if (note?.document) formatData["file"] = note.document

    const formData = new FormData()

    Object.entries(formatData).forEach(([key, value]) => {
      Array.isArray(value)
        ? value.forEach((v) => formData.append(key, v))
        : formData.append(key, value)
    })

    return formData
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const note = formatCreateNote(values)
      await createNote(note)

      setValues(initialValues)
      showToast("¡Has añadido nuevo/s apunte/s!")
      setIsSubmitting(false)
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <Page overflowY="auto">
      <PageHeader title="Nuevo apunte" />

      <Center>
        <Flex
          minH="990px"
          w="460px"
          p="48px 32px"
          borderRadius="2px"
          bgColor="white"
          flexDirection="column"
          boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
          mb="90px"
        >
          <NewNoteForm
            value={values}
            onChange={(val) => setValues(val)}
            submitIsDisabled={submitIsDisabled}
          />

          <Button
            w="194px"
            margin="0 auto"
            mt="24px"
            disabled={submitIsDisabled}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            pointerEvents={isSubmitting ? "none" : "all"}
          >
            Guardar
          </Button>
        </Flex>
      </Center>
    </Page>
  )
}

export default nuevo
