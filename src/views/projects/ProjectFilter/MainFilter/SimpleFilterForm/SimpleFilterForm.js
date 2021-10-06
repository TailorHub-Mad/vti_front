import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../../components/forms/AddSelect/AddSelect"
import { InputSelect } from "../../../../../components/forms/InputSelect/InputSelect"
import useSystemApi from "../../../../../hooks/api/useSystemApi"
import useClientApi from "../../../../../hooks/api/useClientApi"
import useUserApi from "../../../../../hooks/api/useUserApi"
import useTagApi from "../../../../../hooks/api/useTagApi"
import useSectorApi from "../../../../../hooks/api/useSectorApi"

export const SimpleFilterForm = ({ openAuxModal, value, onChange }) => {
  const { getSystems } = useSystemApi()
  const { getClients } = useClientApi()
  const { getUsers } = useUserApi()
  const { getProjectTags } = useTagApi()
  const { getSectors } = useSectorApi()

  // Filter Options
  const [clientsOpt, setClientsOpt] = useState(null)
  const [testSystemsOpt, setTestSystemsOpt] = useState(null)
  const [vtiCodesOpt, setVtiCodesOpt] = useState(null)
  const [usersOpt, setUsersOpt] = useState(null)
  const [projectTagsOpt, setProjectTagsOpt] = useState(null)
  const [sectorsOpt, setSectorsOpt] = useState(null)
 

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
    if (!projectTagsOpt) {
      const fetchNoteTags = async () => {
        const data = await getProjectTags()
        setProjectTagsOpt(data.map((ptag) => ({ label: ptag.name, value: ptag.id })))
      }
      fetchNoteTags()
    }
  }, [projectTagsOpt])

  useEffect(() => {
    if (!sectorsOpt) {
      const fetchSectors = async () => {
        const data = await getSectors()
        setSectorsOpt(data.map((sc) => ({ label: sc.name, value: sc._id })))
      }
      fetchSectors()
    }
  }, [sectorsOpt])

  const filterInputs = {
    client: {
      type: "select",
      config: {
        placeholder: "Cliente",
        options: clientsOpt,
        label: "Cliente"
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
    code_vti: {
      type: "add_select",
      config: {
        placeholder: "Código",
        options: vtiCodesOpt,
        label: "Códigos VTI",
        additemlabel: "Añadir ",
        removeitemlabel: "Añadir "
      }
    },
    focus_point: {
      type: "add_select",
      config: {
        placeholder: "Punto focal",
        options: usersOpt,
        label: "Punto focal",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar "
      }
    },
    sector: {
      type: "select",
      config: {
        placeholder: "Sistema",
        options: testSystemsOpt,
        label: "Sector"
      }
    },
    tag_project: {
      type: "add_select",
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
    }
  }

  const inputRefObj = {
    select: <InputSelect />,
    add_select: <AddSelect />
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
