import { Button, Flex, Center } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import useHelpApi from "../../hooks/api/useHelpApi"
import useNoteApi from "../../hooks/api/useNoteApi"
import useTagApi from "../../hooks/api/useTagApi"
import { ToastContext } from "../../provider/ToastProvider"
import { errorHandler } from "../../utils/errors"
import { SupportModal } from "../../views/helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"
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
  const { getNoteHelps } = useHelpApi()
  const { getNoteTags } = useTagApi()

  const [showSecondaryContent, setShowSecondaryContent] = useState(true)
  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [usedNoteTags, setUsedNoteTags] = useState([])
  const [noteCriteria, setNoteCriteria] = useState([])

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
      showToast({ message: "¡Has añadido nuevo/s apunte/s!" })
      setIsSubmitting(false)
    } catch (error) {
      errorHandler(error)
    }
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
  return (
    <Page overflowY="auto">
      <PageHeader title="Nuevo apunte" />

      <Flex
        minH="990px"
        w="460px"
        p="48px 32px"
        borderRadius="2px"
        bgColor="white"
        flexDirection="column"
        boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
        mb="90px"
        width="460px"
        position="relative"
        top="0"
        marginBottom="50px"
        left={showSecondaryContent ? "calc(50vw - 750px)" : "calc(50vw - 460px)"}
        transition="left 0.18s ease-in-out"
        padding="32px"
      >
        <NewNoteForm
          value={values}
          onChange={(val) => setValues(val)}
          submitIsDisabled={submitIsDisabled}
          openAuxModal={() => setShowSecondaryContent(true)}
        />

        <Button
          w="194px"
          margin="0 auto"
          mt="24px"
          disabled={submitIsDisabled}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          pointerEvents={isSubmitting ? "none" : "all"}
          openAuxModal={() => setShowSecondaryContent(true)}
        >
          Guardar
        </Button>
      </Flex>

      {showSecondaryContent ? (
        <SupportModal
          onClose={() => setShowSecondaryContent(false)}
          usedTags={usedNoteTags}
          criteria={noteCriteria}
          onTagsSelect={(tags) => handleTagSelect(tags, true)}
          selectedTags={values?.tags?.map((t) => t.label) || []}
          top="100px"
        />
      ) : null}
    </Page>
  )
}

export default nuevo
