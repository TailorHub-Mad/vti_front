import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { MultiTagSelect } from "../../../../components/forms/MultiTagSelect/MultiTagSelect"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useClientApi from "../../../../hooks/api/useClientApi"
import useSectorApi from "../../../../hooks/api/useSectorApi"
import useUserApi from "../../../../hooks/api/useUserApi"
import useSystemApi from "../../../../hooks/api/useSystemApi"
import useTagApi from "../../../../hooks/api/useTagApi"
import {
  destructuringDate,
  formatDateToInput
} from "../../../../utils/functions/date"

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
  const { getProjectTags } = useTagApi()

  const [clientOptions, setClientOptions] = useState([])
  const [clientData, setClientData] = useState([])
  const [sectorOptions, setSectorOptions] = useState([])
  const [userOptions, setUserOptions] = useState([])
  const [systemOptions, setSystemOptions] = useState([])
  const [tagOptions, setTagOptions] = useState([])

  console.log("value", value)

  const formatValues = !projectToUpdate
    ? { ...value }
    : {
        ...value,
        focusPoint: {
          label: projectToUpdate.focusPoint[0].alias
        },
        testSystems:
          projectToUpdate.testSystems.length > 0
            ? projectToUpdate.testSystems.map((system) => ({
                label: system.alias
              }))
            : undefined,
        tags:
          projectToUpdate.tags.length > 0
            ? projectToUpdate.tags.map((tag) => ({
                label: tag.name,
                value: tag._id
              }))
            : undefined
      }

  const formatClients = (_clients) =>
    _clients.map((client) => ({ label: client.alias, value: client._id }))

  const formatSectors = (_sectors) =>
    _sectors.map((sector) => ({ label: sector.title, value: sector._id }))

  const formatUsers = (_users) =>
    _users.map((user) => ({ label: user.alias, value: user._id }))

  const formatSystems = (_systems) => {
    if (_systems.length === 0) return []
    return _systems.map((system) => ({
      label: system.alias,
      value: system._id
    }))
  }

  const formatTags = (_tags) =>
    _tags.map((tag) => ({ label: tag.name, value: tag._id }))

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    alias: {
      type: "text",
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
      type: "text",
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
    },
    tags: {
      type: "multitag_select",
      config: {
        placeholder: "Tags de proyecto",
        options: tagOptions,
        label: "Tags de proyecto",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar "
      }
    }
  }

  useEffect(() => {
    const _getClients = async () => {
      const clients = await getClients()
      const fiteredClients = clients.filter((p) => p.testSystems.length > 0)
      setClientData(fiteredClients)
      setClientOptions(formatClients(fiteredClients))
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
      if (projectToUpdate) return
      const systems = await getSystems()

      setSystemOptions(formatSystems(systems[0]?.testSystems))
    }
    const _getTags = async () => {
      const tags = await getProjectTags()
      setTagOptions(formatTags(tags))
    }

    _getClients()
    _getSectors()
    _getUsers()
    _getSystems()
    _getTags()
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
    const systems = systemOptions.filter((_system) =>
      _systemsFormat.includes(_system.label)
    )

    if (systems.length === 0) return

    handleFormChange("testSystems", systems)
  }, [projectToUpdate, systemOptions])

  // Tags
  useEffect(() => {
    if (!projectToUpdate || tagOptions.length === 0) return

    const _tagsFormat = projectToUpdate?.tags.map((t) => t.name)
    const tags = tagOptions.filter((_tag) => _tagsFormat.includes(_tag.label))

    if (tags.length === 0) return
    handleFormChange("tags", tags)
  }, [projectToUpdate, tagOptions])

  const handleSystemOptions = () => {
    const client = value.client

    if (!client || !client.value) return

    const data = clientData.find((c) => c._id === client.value)

    if (!data?.testSystems) return

    setSystemOptions(formatSystems(data?.testSystems))
  }

  useEffect(() => {
    handleSystemOptions()
  }, [value.client])

  useEffect(() => {
    if (!projectToUpdate && value?.client?.value) return

    handleSystemOptions()
  }, [projectToUpdate, value.client])

  const inputRefObj = {
    text: <SimpleInput />,
    select: <InputSelect />,
    add_select: <AddSelect />,
    multitag_select: <MultiTagSelect />
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        let auxValue = formatValues[name]

        if (
          name === "date" &&
          value[Object.keys(value)[index - 1]] &&
          !formatValues[name]
        ) {
          auxValue = formatDateToInput(destructuringDate(new Date()))
          handleFormChange(name, auxValue)
        }

        return React.cloneElement(inputRefObj[type], {
          value: auxValue,
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
