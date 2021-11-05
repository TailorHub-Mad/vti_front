import { Button, Flex, Text } from "@chakra-ui/react"
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
import { ProjectSupportModal } from "../../views/projects/ProjectFilter/ProjectSupportModal/ProjectSupportModal"

const initialValues = {
  project: undefined,
  system: undefined,
  title: undefined,
  description: undefined,
  tags: undefined,
  link: undefined,
  documents: undefined
}

const nuevo = () => {
  const { showToast } = useContext(ToastContext)
  const { createNote } = useNoteApi()
  const { getNoteHelps } = useHelpApi()
  const { getNoteTags } = useTagApi()

  const [showTagSupportModal, setShowTagSupportModal] = useState(false)
  const [showProjectSearchModal, setShowProjectSearchModal] = useState(false)

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [usedNoteTags, setUsedNoteTags] = useState([])
  const [noteCriteria, setNoteCriteria] = useState([])
  const [resetForm, setResetForm] = useState(false)

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

  const handleProjectSelect = (_project) => {
    setValues({ ...values, project: _project })
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

  const formatCreateNote = (note) => {
    const formatData = {
      project: note.project.value,
      testSystems: note.testSystems.map((s) => s.value),
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const note = formatCreateNote(values)

      await createNote(note)

      setValues(initialValues)
      setResetForm(true)
      setTimeout(() => {
        setResetForm(false)
      }, 1000)
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
    <Page overflowY="auto" newNote>
      <PageHeader
        title="Nuevo apunte"
        position="fixed"
        top="32px"
        display={["none", "none", "block", "block"]}
      />
      <Flex justify="center" pt={["0", "0", "0", "100px"]}>
        <Flex
          w="460px"
          borderRadius="2px"
          bgColor="white"
          flexDirection="column"
          boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
          mb={["0", "0", "0", "90px"]}
          position="sticky"
          top="0"
          marginBottom={["0", "0", "0", "50px"]}
          transition="left 0.18s ease-in-out"
          padding={["16px", "0", "0", "32px"]}
          pb={["80px", null, null, null]}
        >
          <Text variant="d_m_medium" pb="32px" pt="24px">
            Añadir nuevo apunte
          </Text>
          <NewNoteForm
            value={values}
            onChange={(val) => setValues(val)}
            submitIsDisabled={submitIsDisabled}
            openAuxModal={() => setShowTagSupportModal(true)}
            openProjectSearchModal={() => {
              setShowProjectSearchModal(true)
            }}
            resetForm={resetForm}
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
              mt={["0", null, null, "24px"]}
              disabled={submitIsDisabled}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              pointerEvents={isSubmitting ? "none" : "all"}
              openAuxModal={() => setShowTagSupportModal(true)}
            >
              Guardar
            </Button>
          </Flex>
        </Flex>

        {showTagSupportModal ? (
          <SupportModal
            onClose={() => setShowTagSupportModal(false)}
            usedTags={usedNoteTags}
            criteria={noteCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags, true)}
            selectedTags={values?.tags?.map((t) => t.label) || []}
            position={["absolute", null, null, "relative"]}
            h={["100%", null, null, null]}
            ml={[null, null, null, "50px"]}
            sx={{
              ">div:first-of-type": {
                boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)"
              }
            }}
          />
        ) : null}
      </Flex>

      <ProjectSupportModal
        isOpen={showProjectSearchModal}
        onClose={() => setShowProjectSearchModal(false)}
        onProjectSelect={handleProjectSelect}
        onTagsSelect={(tags) => handleTagSelect(tags, true)}
        selectedTags={values?.tags?.map((t) => t.label) || []}
      />
    </Page>
  )
}

export default nuevo
