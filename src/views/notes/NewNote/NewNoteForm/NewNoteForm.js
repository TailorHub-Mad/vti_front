import { FormLabel } from "@chakra-ui/form-control"
import { Flex } from "@chakra-ui/layout"
import { useMediaQuery } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { FileInput } from "../../../../components/forms/FileInput/FileInput"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { MultiTagSelect } from "../../../../components/forms/MultiTagSelect/MultiTagSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import { TextAreaInput } from "../../../../components/forms/TextAreaInput/TextAreaInput"
import useProjectApi from "../../../../hooks/api/useProjectApi"
import useTagApi from "../../../../hooks/api/useTagApi"

export const NewNoteForm = ({
  openAuxModal,
  openProjectSearchModal,
  value,
  onChange,
  noteToUpdate,
  noteFromProject,
  submitIsDisabled,
  isUpdate,
  resetForm
}) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  const { getProjects } = useProjectApi()
  const { getNoteTags } = useTagApi()

  const [projectOptions, setProjectOptions] = useState([])
  const [projectData, setProjectData] = useState([])
  const [systemOptions, setSystemOptions] = useState([])
  const [tagOptions, setTagOptions] = useState([])

  const [isReset, setIsReset] = useState(false)

  const _values = { ...value }

  const formatSelectOption = (data) =>
    data.map((d) => ({ label: d.alias, value: d._id }))

  const formatTags = (_tags) =>
    _tags.map((tag) => ({ label: tag.name, value: tag._id }))

  const handleFormChange = (input, _value) => {
    if (input === "project" && !noteToUpdate) setIsReset(true)
    else if (isReset) setIsReset(false)

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
        isDisabled: Boolean(noteToUpdate) || Boolean(noteFromProject),
        helper: isScreen ? "Abrir ventana de apoyo" : null,
        onHelperClick: isScreen ? () => openProjectSearchModal() : null
      }
    },
    testSystems: {
      type: "add_select",
      config: {
        placeholder: "Selecciona",
        label: "Selecciona el sistema utilizado en el proyecto*",
        options: systemOptions,
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
        isReset: isReset,
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
      type: "multitag_select",
      config: {
        placeholder: "Tags de apunte",
        options: tagOptions,
        label: "Tags de apunte",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal()
      }
    },
    link: {
      type: "text",
      config: {
        placeholder: "Escriba un link",
        label: "Link (opcional)"
      }
    },
    documents: {
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
      const fiteredProjects = _projects.filter((p) => p.testSystems.length > 0)
      setProjectData(fiteredProjects)
      setProjectOptions(formatSelectOption(fiteredProjects))
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

  // System
  useEffect(() => {
    if (!noteToUpdate || systemOptions.length === 0) return
    const _systemsFormat = noteToUpdate?.testSystems.map((s) => s.alias)
    const systems = systemOptions.filter((_system) =>
      _systemsFormat.includes(_system.label)
    )
    if (systems.length === 0) return
    handleFormChange("testSystems", systems)
  }, [noteToUpdate, systemOptions])

  // Tags
  useEffect(() => {
    if (!noteToUpdate || tagOptions.length === 0) return

    const _tagsFormat = noteToUpdate.tags.map((t) => t.name)
    const tags = tagOptions.filter((_tag) => _tagsFormat.includes(_tag.label))

    if (tags.length === 0) return

    handleFormChange("tags", tags)
  }, [noteToUpdate, tagOptions])

  const handleSystemOptions = () => {
    const project = value.project

    if (!project || !project.value) return

    const data = noteFromProject ?? projectData.find((p) => p._id === project.value)

    if (!data?.testSystems) return

    const _systemsOptions = noteFromProject
      ? data?.testSystems
      : formatSelectOption(data?.testSystems)

    const allSystems = {
      label: "Todos",
      value: _systemsOptions.map((so) => so.value)
    }
    const noSystems = { label: "Ninguno", value: [] }

    setSystemOptions([allSystems, noSystems, ..._systemsOptions])
  }

  useEffect(() => {
    handleSystemOptions()
  }, [value.project])

  useEffect(() => {
    if (!noteToUpdate && value?.project?.value) return

    handleSystemOptions()
  }, [noteToUpdate, value.project])

  const inputRefObj = {
    text: <SimpleInput marginBottom="24px" mt="16px" />,
    textarea: <TextAreaInput marginBottom="32px" mt="24px" />,
    select: <InputSelect marginBottom="24px" />,
    add_select: <AddSelect marginBottom="24px" />,
    attachment: <FileInputForm isUpdate={isUpdate} marginBottom="24px" />,
    multitag_select: <MultiTagSelect marginBottom="24px" />
  }

  useEffect(() => {
    if (resetForm) setIsReset(true)
  }, [resetForm])

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: _values[name],
          onChange: (val) => handleFormChange(name, val),
          isDisabled:
            index !== 0 && submitIsDisabled && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}

const FileInputForm = ({ value, onChange, isDisabled, isUpdate }) => {
  return (
    <Flex flexDirection="column">
      <FormLabel
        margin="0"
        marginRight="4px"
        display="flex"
        alignItems="center"
        color={isDisabled ? "#E2E8F0" : "#052E57"}
        marginTop="24px"
      >
        Adjunta tus documentos (opcional)
      </FormLabel>
      <FileInput
        value={value || ""}
        onChange={onChange}
        isDisabled={isDisabled}
        isUpdate={isUpdate}
      />
    </Flex>
  )
}
