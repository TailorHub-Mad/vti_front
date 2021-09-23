import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useClientApi from "../../../../hooks/api/useClientApi"
import useSectorApi from "../../../../hooks/api/useSectorApi"
import useUserApi from "../../../../hooks/api/useUserApi"
import useSystemApi from "../../../../hooks/api/useSystemApi"

export const NewProjectForm = ({
  // openAuxModal,
  value,
  onChange,
  projectToUpdate
}) => {
  const { getClients } = useClientApi()
  const { getSectors } = useSectorApi()
  const { getUsers } = useUserApi()
  const { getSystems } = useSystemApi()

  const [clientOptions, setClientOptions] = useState([])
  const [sectorOptions, setSectorOptions] = useState([])
  const [userOptions, setUserOptions] = useState([])
  const [systemOptions, setSystemOptions] = useState([])

  const formatValues = !projectToUpdate
    ? { ...value }
    : {
        ...value,
        focusPoint: {
          label: projectToUpdate.focusPoint[0].alias
        },
        testSystems: projectToUpdate.testSystems.map((system) => ({
          label: system.alias
        }))
      }

  const formatClients = (_clients) =>
    _clients.map((client) => ({ label: client.alias, value: client._id }))

  const formatSectors = (_sectors) =>
    _sectors.map((sector) => ({ label: sector.title, value: sector._id }))

  const formatUsers = (_users) =>
    _users.map((user) => ({ label: user.alias, value: user._id }))

  const formatSystems = (_systems) => {
    if (_systems.length === 0) return []
    return _systems[0].testSystems.map((system) => ({
      label: system.alias,
      value: system._id
    }))
  }

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    alias: {
      type: "input",
      config: {
        placeholder: "Alias",
        label: "Alias"
      }
    },
    client: {
      type: "select",
      config: {
        placeholder: "Cliente",
        options: clientOptions,
        label: "Cliente",
        disabled: Boolean(projectToUpdate)
      }
    },
    sector: {
      type: "select",
      config: {
        placeholder: "Sector",
        options: sectorOptions,
        label: "Sector"
      }
    },
    date: {
      type: "input",
      config: {
        type: "date",
        placeholder: "00/00/0000",
        label: "Fecha",
        disabled: Boolean(projectToUpdate)
      }
    },
    focusPoint: {
      type: "select",
      config: {
        placeholder: "Punto focal inicio",
        options: userOptions,
        label: "Punto focal inicio",
        disabled: Boolean(projectToUpdate)
      }
    },
    testSystems: {
      type: "add_select",
      config: {
        placeholder: "Sistemas de ensayo",
        options: systemOptions,
        label: "Sistemas de ensayo",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar "
      }
    }
    // tags: {
    //   type: "add_select",
    //   config: {
    //     placeholder: "Proyecto",
    //     options: MOCK_SELECT_OPTIONS,
    //     label: "Tags de proyecto",
    //     additemlabel: "Añadir ",
    //     removeitemlabel: "Eliminar ",
    //     helper: "Abrir ventana de ayuda",
    //     onHelperClick: () => openAuxModal(),
    //     isDisabled: true // TODO -> provisional
    //   }
    // }
  }

  useEffect(() => {
    const _getClients = async () => {
      const clients = await getClients()
      setClientOptions(formatClients(clients))
    }
    const _getSectors = async () => {
      const sectors = await getSectors()
      setSectorOptions(formatSectors(sectors))
    }
    const _getUsers = async () => {
      const users = await getUsers()
      setUserOptions(formatUsers(users))
    }
    const _getSystems = async () => {
      const systems = await getSystems()
      setSystemOptions(formatSystems(systems))
    }
    _getClients()
    _getSectors()
    _getUsers()
    _getSystems()
  }, [])

  // Clients
  useEffect(() => {
    if (!projectToUpdate || clientOptions.length === 0) return

    const client = clientOptions.find(
      (_client) => _client.label === projectToUpdate?.clientAlias
    )

    handleFormChange("client", client)
  }, [projectToUpdate, clientOptions])

  // Sector
  useEffect(() => {
    if (!projectToUpdate || sectorOptions.length === 0) return

    const sector = sectorOptions.find(
      (_sector) => _sector.label === projectToUpdate?.sector[0].title
    )

    handleFormChange("sector", sector)
  }, [projectToUpdate, sectorOptions])

  // Focus point
  useEffect(() => {
    if (!projectToUpdate || userOptions.length === 0) return

    const user = userOptions.find(
      (_user) => _user.label === projectToUpdate?.focusPoint[0].alias
    )

    handleFormChange("focusPoint", user)
  }, [projectToUpdate, userOptions])

  // System
  useEffect(() => {
    if (!projectToUpdate || systemOptions.length === 0) return

    const _systemsFormat = projectToUpdate?.testSystems.map((s) => s.alias)
    const system = systemOptions.filter((_system) =>
      _systemsFormat.includes(_system.label)
    )

    handleFormChange("testSystems", system)
  }, [projectToUpdate, systemOptions])

  const inputRefObj = {
    input: <SimpleInput />,
    select: <InputSelect />,
    add_select: <AddSelect />
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: formatValues[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: "24px",
          isDisabled:
            config.disabled ||
            (index !== 0 && !value[Object.keys(value)[index - 1]]),
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}
