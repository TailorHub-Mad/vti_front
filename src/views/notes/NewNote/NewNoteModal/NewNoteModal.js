import { Modal, ModalOverlay, ScaleFade, Button, Box, Flex } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalContent } from "../../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useHelpApi from "../../../../hooks/api/useHelpApi"
import useNoteApi from "../../../../hooks/api/useNoteApi"
import useTagApi from "../../../../hooks/api/useTagApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { createFormData } from "../../../../utils/functions/formdata"
import { SupportModal } from "../../../helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"
import { NewNoteForm } from "../NewNoteForm/NewNoteForm"

const initialValues = {
  project: undefined,
  system: undefined,
  title: undefined,
  description: undefined,
  tags: undefined,
  link: undefined,
  documents: undefined
}

export const NewNoteModal = ({
  isOpen,
  onClose,
  noteToUpdate,
  noteFromProject,
  ...props
}) => {
  const { showToast } = useContext(ToastContext)
  const { createNote, updateNote } = useNoteApi()
  const { getProjectHelps } = useHelpApi()
  const { getProjectTags } = useTagApi()
  const { mutate } = useSWRConfig()

  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [usedProjectTags, setUsedProjectTags] = useState([])
  const [projectCriteria, setProjectCriteria] = useState([])

  const isUpdate = Boolean(noteToUpdate)

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
    if (note?.documents) formatData["file"] = note.documents

    const formData = new FormData()

    Object.entries(formatData).forEach(([key, value]) => {
      Array.isArray(value)
        ? value.forEach((v) => formData.append(key, v))
        : formData.append(key, value)
    })

    return formData
  }

  const formatUpdateNote = (note) => {
    const _formatData = {}
    const formatData = {
      title: note.title,
      description: note.description,
      tags: note.tags.map((t) => t.value)
    }

    if (note?.link) formatData["link"] = note.link

    if (note?.documents) {
      const { files, documents } = note.documents.reduce(
        (acc, doc) => {
          if (doc.path) acc.files.push(doc)
          else acc.documents.push(doc)
          return acc
        },
        {
          files: [],
          documents: []
        }
      )

      _formatData["documents"] = documents
      _formatData["file"] = files
    }

    const formData = createFormData(_formatData)

    Object.entries(formatData).forEach(([key, value]) => {
      Array.isArray(value)
        ? value.forEach((v) => formData.append(key, v))
        : formData.append(key, value)
    })

    return formData
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateNote() : await handleCreateNote()
    setValues(initialValues)
    noteFromProject
      ? await mutate([SWR_CACHE_KEYS.project, noteFromProject.project.value])
      : await mutate(SWR_CACHE_KEYS.notes)
    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s apunte/s!")
    setIsSubmitting(false)
    handleOnClose()
  }

  const handleCreateNote = async () => {
    try {
      const note = formatCreateNote(values)
      await createNote(note)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateNote = async () => {
    try {
      const note = formatUpdateNote(values)
      await updateNote(noteToUpdate._id, note)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    if (noteFromProject)
      setValues({
        project: values.project
      })
    else setValues(initialValues)
    onClose()
  }

  const handleTagSelect = (_tags) => {
    const refTags = values.tags
    const refUsed = usedProjectTags
    let nextTags = refTags ? [...refTags] : []

    _tags.forEach((_tag) => {
      if (nextTags.map((t) => t.label).includes(_tag)) {
        nextTags = nextTags.filter((rt) => rt.label !== _tag)
        return
      }
      const [tagInfo] = refUsed.filter((t) => _tag === t.name)
      const selectedTag = { label: tagInfo.name, value: tagInfo._id }
      nextTags.push(selectedTag)
    })
    setValues({
      ...values,
      tags: nextTags
    })
  }

  useEffect(() => {
    const fetchCriteria = async () => {
      const _data = await getProjectHelps()
      setProjectCriteria(_data)
    }

    const fetchTags = async () => {
      const _tags = await getProjectTags()
      const _used = _tags.filter((tag) => !tag.isUsed)
      setUsedProjectTags(_used)
    }

    fetchCriteria()
    fetchTags()
  }, [])

  useEffect(() => {
    if (!noteToUpdate) return

    const _note = {
      project: noteToUpdate.projects[0].alias,
      system: noteToUpdate.testSystems.map((ts) => ts.alias),
      title: noteToUpdate.title,
      description: noteToUpdate.description,
      link: noteToUpdate.link,
      documents: noteToUpdate.documents,
      tags: noteToUpdate.tags.map((t) => t.name)
    }

    setValues(_note)
  }, [noteToUpdate])

  useEffect(() => {
    if (!noteFromProject) return
    setValues(noteFromProject)
  }, [noteFromProject])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade
          padding="100px"
          in={showSecondaryContent || !showSecondaryContent}
        >
          <Box
            width="460px"
            position="relative"
            top="50px"
            marginBottom="50px"
            left={showSecondaryContent ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
            transition="left 0.18s ease-in-out"
            bgColor="white"
            borderRadius="2px"
            padding="32px"
            {...props}
          >
            <CustomModalHeader
              title={isUpdate ? "Editar apunte" : "Añadir nuevo apunte"}
              onClose={handleOnClose}
              pb="24px"
            />
            <NewNoteForm
              value={values}
              onChange={(val) => setValues(val)}
              noteToUpdate={noteToUpdate}
              noteFromProject={noteFromProject}
              submitIsDisabled={submitIsDisabled}
              isUpdate={Boolean(noteToUpdate)}
              openAuxModal={() => setShowSecondaryContent(true)}
            />
            <Flex width="100%" justifyContent="center">
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
          </Box>
        </ScaleFade>
        {showSecondaryContent ? (
          <SupportModal
            onClose={() => setShowSecondaryContent(false)}
            usedTags={usedProjectTags}
            criteria={projectCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags, true)}
            selectedTags={values?.tags?.map((t) => t.label) || []}
          />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
