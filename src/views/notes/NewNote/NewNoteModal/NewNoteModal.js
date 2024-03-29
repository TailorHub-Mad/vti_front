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
import { ProjectSupportModal } from "../../../projects/ProjectFilter/ProjectSupportModal/ProjectSupportModal"
import { NewNoteForm } from "../NewNoteForm/NewNoteForm"

const initialValues = {
  project: undefined,
  testSystems: undefined,
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
  fromProjectDetail,
  ...props
}) => {
  const { showToast } = useContext(ToastContext)
  const { createNote, updateNote } = useNoteApi()
  const { getNoteHelps } = useHelpApi()
  const { getNoteTags } = useTagApi()
  const { mutate } = useSWRConfig()

  const [showProjectSearchModal, setShowProjectSearchModal] = useState(false)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [usedNoteTags, setUsedNoteTags] = useState([])
  const [noteCriteria, setNoteCriteria] = useState([])

  const isUpdate = Boolean(noteToUpdate)

  const checkInputsAreEmpty = () => {
    return (
      !values.project ||
      !values.testSystems ||
      !values.title ||
      !values.description ||
      !values.tags
    )
  }

  const submitIsDisabled = checkInputsAreEmpty()

  const formatCreateNote = (note) => {
    const formatSystems =
      note.testSystems[0].label === "TODOS"
        ? [...note.testSystems[0].value]
        : note.testSystems[0].label === "NINGUNO"
        ? null
        : note.testSystems.map((s) => s.value)

    const formatData = {
      project: note.project.value,
      title: note.title,
      description: note.description,
      tags: note.tags.map((t) => t.value)
    }

    if (formatSystems) formatData["testSystems"] = formatSystems

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
      testSystems:
        note.testSystems[0].value !== "" ? note.testSystems[0].value : null,
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

  const handleProjectSelect = (_project) => {
    setValues({ ...values, project: _project })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateNote() : await handleCreateNote()
    setValues(initialValues)

    await mutate([
      SWR_CACHE_KEYS.filterNotes,
      `notes.projects._id=${fromProjectDetail}`
    ])
    await mutate(SWR_CACHE_KEYS.notes)
    showToast({
      message: isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s apunte/s!",
      secondaryMessage: isUpdate
        ? null
        : "Tiene una hora para editarlo antes de que se publique, después de ese tiempo, tendrá que solicitarlo al administrador"
    })
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
    const refUsed = usedNoteTags
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
      const _data = await getNoteHelps()
      setNoteCriteria(_data)
    }

    const fetchTags = async () => {
      const _tags = await getNoteTags()
      const _used = _tags.filter((tag) => !tag.isUsed)
      setUsedNoteTags(_used)
    }

    fetchCriteria()
    fetchTags()
  }, [])

  useEffect(() => {
    if (!noteToUpdate) return

    const ts = noteToUpdate.testSystems.map((ts) => ({
      label: ts.alias,
      value: ts._id
    }))

    const _note = {
      project: noteFromProject
        ? noteFromProject.project
        : noteToUpdate?.projects[0]?.alias,
      testSystems: ts.length > 0 ? ts : undefined,
      title: noteToUpdate.title,
      description: noteToUpdate.description,
      link: noteToUpdate.link,
      documents: noteToUpdate.documents,
      tags: noteToUpdate.tags.map((t) => ({
        label: t.name,
        value: t._id
      }))
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
            width={["100%", null, null, "460px"]}
            position="relative"
            top={["0", null, null, "50px"]}
            marginBottom={["0", null, null, "50px"]}
            left={[
              "0",
              null,
              null,
              showSecondaryContent ? "calc(50vw - 500px)" : "calc(50vw - 230px)"
            ]}
            transition={["none", null, null, "left 0.18s ease-in-out"]}
            bgColor="white"
            borderRadius="2px"
            padding={["16px", null, null, "32px"]}
            pb={["96px", null, null, null]}
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
              openProjectSearchModal={() => setShowProjectSearchModal(true)}
              openAuxModal={() => setShowSecondaryContent(true)}
            />
            <Flex
              justifyContent={"center"}
              position={["fixed", null, null, "relative"]}
              bottom={["0", null, null, null]}
              left={["0", null, null, null]}
              width="100%"
              pb={["8px", null, null, null]}
              pt={["8px", null, null, null]}
              boxShadow={["0px -4px 8px rgba(5, 46, 87, 0.1)", null, null, "none"]}
              bgColor={["white", null, null, null]}
            >
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
            usedTags={usedNoteTags}
            criteria={noteCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags, true)}
            selectedTags={values?.tags?.map((t) => t.label) || []}
          />
        ) : null}
        <ProjectSupportModal
          isOpen={showProjectSearchModal}
          onClose={() => setShowProjectSearchModal(false)}
          onProjectSelect={handleProjectSelect}
          onTagsSelect={(tags) => handleTagSelect(tags, true)}
          selectedTags={values?.tags?.map((t) => t.label) || []}
        />
      </CustomModalContent>
    </Modal>
  )
}
