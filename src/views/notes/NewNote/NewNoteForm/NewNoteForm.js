import { FormLabel } from "@chakra-ui/form-control"
import { Flex } from "@chakra-ui/layout"
import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { FileInput } from "../../../../components/forms/FileInput/FileInput"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import { TextAreaInput } from "../../../../components/forms/TextAreaInput/TextAreaInput"
import useProjectApi from "../../../../hooks/api/useProjectApi"
import useTagApi from "../../../../hooks/api/useTagApi"

export const NewNoteForm = ({
  value,
  onChange,
  noteToUpdate,
  noteFromProject,
  submitIsDisabled
}) => {
  const { getProjects } = useProjectApi()
  const { getNoteTags } = useTagApi()

  const [projectOptions, setProjectOptions] = useState([])
  const [projectData, setProjectData] = useState([])
  const [systemOptions, setSystemOptions] = useState([])
  const [tagOptions, setTagOptions] = useState([])

  const formatValues = !noteToUpdate
    ? { ...value }
    : {
        ...value,
        tags:
          noteToUpdate.tags.length > 0
            ? noteToUpdate.tags.map((tag) => ({
                label: tag.name,
                value: tag._id
              }))
            : undefined
      }

  const formatSelectOption = (data) =>
    data.map((d) => ({ label: d.alias, value: d._id }))

  const formatTags = (_tags) =>
    _tags.map((tag) => ({ label: tag.name, value: tag._id }))

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    project: {
      type: "select",
      config: {
        placeholder: "Selecciona",
        label: "Selecciona el proyecto*",
        options: projectOptions,
        isDisabled: Boolean(noteFromProject) || Boolean(noteToUpdate)
      }
    },
    system: {
      type: "add_select",
      config: {
        placeholder: "Selecciona",
        label: "Selecciona el sistema utilizado en el proyecto*",
        options: systemOptions,
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
        isDisabled: Boolean(noteToUpdate)
      }
    },
    title: {
      type: "text",
      config: {
        placeholder: "Escribe un título",
        label: "Título*"
      }
    },
    description: {
      type: "textarea",
      config: {
        placeholder: "Describe el apunte",
        label: "Descripción*"
      }
    },
    tags: {
      type: "add_select",
      config: {
        placeholder: "Tags de proyecto",
        options: tagOptions,
        label: "Tags de proyecto",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar "
      }
    },
    link: {
      type: "text",
      config: {
        placeholder: "Escriba un link",
        label: "Link (opcional)"
      }
    },
    document: {
      type: "attachment",
      config: {
        label: "Adjunta tus documentos"
      }
    }
  }

  useEffect(() => {
    const _getProjects = async () => {
      const data = await getProjects()
      const _projects = data[0]?.projects || []
      setProjectData(_projects)
      setProjectOptions(formatSelectOption(_projects))
    }
    const _getTags = async () => {
      const tags = await getNoteTags()
      setTagOptions(formatTags(tags))
    }

    if (!noteFromProject) _getProjects()
    _getTags()
  }, [])

  // Projects
  useEffect(() => {
    if (!noteToUpdate || projectOptions.length === 0) return

    const project = projectOptions.find(
      (_project) => _project.label === noteToUpdate?.projects[0].alias
    )

    handleFormChange("project", project)
  }, [noteToUpdate, projectOptions])

  // Tags
  useEffect(() => {
    if (!noteToUpdate || tagOptions.length === 0) return

    const _tagsFormat = noteToUpdate.tags.map((t) => t.name)
    const tags = tagOptions.filter((_tag) => _tagsFormat.includes(_tag.label))

    if (tags.length === 0) return

    handleFormChange("tags", tags)
  }, [noteToUpdate, tagOptions])

  useEffect(() => {
    const project = value.project

    if (!project || !project.value) return

    const { testSystems } = noteFromProject
      ? noteFromProject
      : projectData.find((p) => p._id === project.value)

    setSystemOptions(noteFromProject ? testSystems : formatSelectOption(testSystems))
  }, [value.project])

  const inputRefObj = {
    text: <SimpleInput />,
    textarea: <TextAreaInput />,
    select: <InputSelect />,
    add_select: <AddSelect />,
    attachment: <FileInputForm />
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: formatValues[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: "24px",
          isDisabled:
            index !== 0 && submitIsDisabled && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}

const FileInputForm = ({ value, onChange, isDisabled }) => {
  return (
    <Flex flexDirection="column" mb="24px">
      <FormLabel
        margin="0"
        marginRight="4px"
        display="flex"
        alignItems="center"
        color={isDisabled ? "#E2E8F0" : "#052E57"}
        mb="8px"
      >
        Adjunta tus documentos (opcional)
      </FormLabel>
      <FileInput value={value} onChange={onChange} isDisabled={isDisabled} />
    </Flex>
  )
}
