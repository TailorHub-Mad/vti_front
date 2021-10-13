import { Checkbox, Switch } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { MOCK_SELECT_OPTIONS } from "../../../../../mock/mock"
import { AddSelect } from "../../../../../components/forms/AddSelect/AddSelect"
import { InputSelect } from "../../../../../components/forms/InputSelect/InputSelect"
import useProjectApi from "../../../../../hooks/api/useProjectApi"
import useSystemApi from "../../../../../hooks/api/useSystemApi"
import useClientApi from "../../../../../hooks/api/useClientApi"
import useUserApi from "../../../../../hooks/api/useUserApi"
import useTagApi from "../../../../../hooks/api/useTagApi"
import { MultiTagSelect } from "../../../../../components/forms/MultiTagSelect/MultiTagSelect"

export const SimpleFilterForm = ({ openAuxModal, value, onChange }) => {
  const { getProjects } = useProjectApi()
  const { getSystems } = useSystemApi()
  const { getClients } = useClientApi()
  const { getUsers } = useUserApi()
  const { getNoteTags, getProjectTags } = useTagApi()

  // Filter Options
  const [projectsOpt, setProjectsOpt] = useState(null)
  const [testSystemsOpt, setTestSystemsOpt] = useState(null)
  const [clientsOpt, setClientsOpt] = useState(null)
  const [vtiCodesOpt, setVtiCodesOpt] = useState(null)
  const [usersOpt, setUsersOpt] = useState(null)
  const [projectTagsOpt, setProjectTagsOpt] = useState(null)
  const [noteTagsOpt, setNoteTagsOpt] = useState(null)

  useEffect(() => {
    if (!projectsOpt) {
      const fetchProjects = async () => {
        const data = await getProjects()
        setProjectsOpt(
          data[0]?.projects.map((pr) => ({ label: pr.alias, value: pr._id }))
        )
      }
      fetchProjects()
    }
  }, [projectsOpt])

  useEffect(() => {
    if (!testSystemsOpt) {
      const fetchTestSystems = async () => {
        const data = await getSystems()
        setTestSystemsOpt(
          data[0]?.testSystems.map((ts) => ({ label: ts.alias, value: ts._id }))
        )
        setVtiCodesOpt(
          data[0]?.testSystems.map((ts) => ({ label: ts.vtiCode, value: ts._id }))
        )
      }
      fetchTestSystems()
    }
  }, [testSystemsOpt])

  useEffect(() => {
    if (!clientsOpt) {
      const fetchClients = async () => {
        const data = await getClients()
        setClientsOpt(data.map((cl) => ({ label: cl.alias, value: cl.alias })))
      }
      fetchClients()
    }
  }, [clientsOpt])

  useEffect(() => {
    if (!usersOpt) {
      const fetchUsers = async () => {
        const data = await getUsers()
        setUsersOpt(data.map((user) => ({ label: user.alias, value: user._id })))
      }
      fetchUsers()
    }
  }, [usersOpt])

  useEffect(() => {
    if (!noteTagsOpt) {
      const fetchNoteTags = async () => {
        const data = await getNoteTags()
        setNoteTagsOpt(data.map((ntag) => ({ label: ntag.name, value: ntag.id })))
      }
      fetchNoteTags()
    }
  }, [noteTagsOpt])

  useEffect(() => {
    if (!projectTagsOpt) {
      const fetchNoteTags = async () => {
        const data = await getProjectTags()
        setProjectTagsOpt(data.map((ptag) => ({ label: ptag.name, value: ptag.id })))
      }
      fetchNoteTags()
    }
  }, [projectTagsOpt])

  const filterInputs = {
    project: {
      type: "select",
      config: {
        placeholder: "Alias proyecto",
        options: projectsOpt,
        label: "Proyecto",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal("project")
      }
    },
    test_system: {
      type: "select",
      config: {
        placeholder: "Sistema",
        options: testSystemsOpt,
        label: "Sistema de ensayo"
      }
    },
    client: {
      type: "select",
      config: {
        placeholder: "Cliente",
        options: clientsOpt,
        label: "Cliente"
      }
    },
    dates: {
      type: "add_select",
      config: {
        placeholder: "Desde 00/00/0000 hasta 00/00/0000",
        options: MOCK_SELECT_OPTIONS,
        label: "Fechas",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
        isDisabled: true
      }
    },
    users: {
      type: "add_select",
      config: {
        placeholder: "Usuario",
        options: usersOpt,
        label: "Usuarios",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar "
      }
    },
    vti_code: {
      type: "add_select",
      config: {
        placeholder: "Código",
        options: vtiCodesOpt,
        label: "Códigos VTI",
        additemlabel: "Añadir ",
        removeitemlabel: "Añadir "
      }
    },
    project_tags: {
      type: "multitag_select",
      config: {
        placeholder: "Proyecto",
        options: projectTagsOpt,
        label: "Tags de proyecto",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal("project_tags"),
        isDisabled: true
      }
    },
    note_tags: {
      type: "multitag_select",
      config: {
        placeholder: "Tags de apunte",
        options: noteTagsOpt,
        label: "Tags de apunte",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal("note_tags")
      }
    },
    only_suscribed: {
      type: "checkbox",
      config: {
        children: "Suscritos",
        marginBottom: "12px",
        display: "flex",
        variant: "filter"
      }
    },
    only_favs: {
      type: "checkbox",
      config: {
        children: "Favoritos",
        marginBottom: "12px",
        display: "flex",
        variant: "filter"
      }
    },
    only_unread: {
      type: "checkbox",
      config: {
        children: "No leídos",
        marginBottom: "24px",
        variant: "filter",
        display: "flex"
      }
    },
    with_links: {
      type: "switch",
      config: {
        children: "Adjunto Link No/Sí",
        marginBottom: "12px"
      }
    },
    formalized: {
      type: "switch",
      config: {
        children: "Formalizado No/Sí",
        marginBottom: "12px"
      }
    },
    closed: {
      type: "switch",
      config: {
        children: "Cerrado No/Sí",
        marginBottom: "12px"
      }
    },
    with_responses: {
      type: "switch",
      config: {
        children: "Con respuestas No/Sí"
      }
    }
  }

  const inputRefObj = {
    select: <InputSelect />,
    add_select: <AddSelect />,
    checkbox: <Checkbox />,
    switch: <Switch />,
    multitag_select: <MultiTagSelect />
  }

  const handleFilterChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value?.target?.checked ? _value.target.checked : _value
    })
  }

  return (
    <>
      {Object.entries(filterInputs).map(([name, { type, config }], idx) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFilterChange(name, val),
          marginBottom: "24px",
          key: `${name}-${idx}`,
          ...config
        })
      })}
    </>
  )
}
