import { FormLabel } from "@chakra-ui/form-control"
import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { FileInput } from "../../../../components/forms/FileInput/FileInput"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useProjectApi from "../../../../hooks/api/useProjectApi"

export const NewNoteForm = ({ value, onChange, noteToUpdate }) => {
  const { getProjects } = useProjectApi()

  const [projectOptions, setProjectOptions] = useState([])
  const [projectData, setProjectData] = useState([])
  const [systemOptions, setSystemOptions] = useState([])

  const formatSelectOption = (data) =>
    data.map((d) => ({ label: d.alias, value: d._id }))

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
        options: projectOptions
        // disabled: Boolean(noteToUpdate)
      }
    },
    system: {
      type: "add_select",
      config: {
        placeholder: "Selecciona",
        label: "Selecciona el sistema utilizado en el proyecto*",
        options: systemOptions,
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar "
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
      type: "text",
      config: {
        placeholder: "Describe el apunte",
        label: "Descripción*"
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
        label: "Adjunta tus documentos",
        isDisabled: true // TODO -> provisional
      }
    }
    // tags: {
    //   type: "add_select",
    //   config: {}
    // }
  }

  useEffect(() => {
    const _getProjects = async () => {
      const data = await getProjects()
      const _projects = data[0].projects
      setProjectData(_projects)
      setProjectOptions(formatSelectOption(_projects))
    }

    _getProjects()
  }, [])

  // Projects
  useEffect(() => {
    if (!noteToUpdate || projectOptions.length === 0) return

    const project = projectOptions.find(
      (_project) => _project.label === noteToUpdate?.project
    )

    handleFormChange("project", project)
  }, [noteToUpdate, projectOptions])

  useEffect(() => {
    const project = value.project

    if (!project || !project.value) return

    const { testSystems } = projectData.find((p) => p._id === project.value)

    setSystemOptions(formatSelectOption(testSystems))
  }, [value.project])

  const inputRefObj = {
    text: <SimpleInput />,
    select: <InputSelect />,
    add_select: <AddSelect />,
    attachment: <FileInputForm />
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: name === "name" ? "0" : "24px",
          isDisabled: index !== 0 && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}

const FileInputForm = ({ value, onChange, isDisabled }) => {
  return (
    <>
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
    </>
  )
}
