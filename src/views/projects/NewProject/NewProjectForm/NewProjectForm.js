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

  const isClientObject = typeof value.client === "object"
  const isSectorObject = typeof value.sector === "object"
  const isUserObject = typeof value.user === "object"
  const isSystemObject = typeof value.testSystems === "object"

  let formatValues = { ...value }

  if (projectToUpdate) {
    formatValues = {
      ...value,
      client: isClientObject ? value.client : { label: value.client, value: "" },
      sector: isSectorObject ? value.sector : { label: value.sector, value: "" },
      user: isUserObject ? value.user : { label: value.user, value: "" },
      testSystems: isSystemObject
        ? value.testSystems
        : { label: value.testSystems, value: "" }
    }
  }

  console.log("formatValues", formatValues)

  const formatClients = (_clients) =>
    _clients.map((client) => ({ label: client.alias, value: client._id }))

  const formatSectors = (_sectors) =>
    _sectors.map((sector) => ({ label: sector.title, value: sector._id }))

  const formatUsers = (_users) =>
    _users.map((user) => ({ label: user.alias, value: user._id }))

  const formatSystems = (_systems) => {
    return _systems.map((system) => ({ label: system.alias, value: system._id }))
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
      const clients = await getSectors()
      setSectorOptions(formatSectors(clients))
    }
    const _getUsers = async () => {
      const clients = await getUsers()
      setUserOptions(formatUsers(clients))
    }
    const _getSystems = async () => {
      const clients = await getSystems()
      setSystemOptions(formatSystems(clients))
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
      (_client) => _client.label === projectToUpdate?.client
    )

    handleFormChange("client", client)
  }, [projectToUpdate, clientOptions])

  // Sectors
  useEffect(() => {
    if (!projectToUpdate || sectorOptions.length === 0) return

    const sector = sectorOptions.find(
      (_sector) => _sector.label === projectToUpdate?.sector
    )

    handleFormChange("sector", sector)
  }, [projectToUpdate, sectorOptions])

  // Users
  useEffect(() => {
    if (!projectToUpdate || userOptions.length === 0) return

    const user = userOptions.find((_user) => _user.label === projectToUpdate?.user)

    handleFormChange("user", user)
  }, [projectToUpdate, userOptions])

  // Systems
  useEffect(() => {
    if (!projectToUpdate || systemOptions.length === 0) return

    const system = systemOptions.find(
      (_system) => _system.label === projectToUpdate?.testSystems
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
