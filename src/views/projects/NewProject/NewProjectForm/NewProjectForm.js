import React from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useClientApi from "../../../../hooks/api/useClientApi"
import useSectorApi from "../../../../hooks/api/useSectorApi"
import useUserApi from "../../../../hooks/api/useUserApi"
import useSystemApi from "../../../../hooks/api/useSystemApi"
import useFetchSWR from "../../../../hooks/useFetchSWR"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"

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

  // TODO -> manage errors & loading state
  const { data: clients } = useFetchSWR(SWR_CACHE_KEYS.clients, getClients)
  const { data: sectors } = useFetchSWR(SWR_CACHE_KEYS.sectors, getSectors)
  const { data: users } = useFetchSWR(SWR_CACHE_KEYS.users, getUsers)
  const { data: systems } = useFetchSWR(SWR_CACHE_KEYS.systems, getSystems)

  const formatClients = (_clients) =>
    _clients.map((client) => ({ label: client.alias, value: client._id }))

  const formatSectors = (_sectors) =>
    _sectors.map((sector) => ({ label: sector.title, value: sector._id }))

  const formatUsers = (_users) =>
    _users.map((user) => ({ label: user.alias, value: user._id }))

  const formatSystems = (_systems) => {
    return _systems.map((system) => ({ label: system.alias, value: system._id }))
  }

  const clientsOptions = clients ? formatClients(clients) : []
  const sectorsOptions = sectors ? formatSectors(sectors) : []
  const usersOptions = users ? formatUsers(users) : []
  const systemsOptions = systems ? formatSystems(systems[0].testSystems) : []

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
        options: clientsOptions,
        label: "Cliente",
        disabled: Boolean(projectToUpdate)
      }
    },
    sector: {
      type: "select",
      config: {
        placeholder: "Sector",
        options: sectorsOptions,
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
        options: usersOptions,
        label: "Punto focal inicio",
        disabled: Boolean(projectToUpdate)
      }
    },
    testSystems: {
      type: "add_select",
      config: {
        placeholder: "Sistemas de ensayo",
        options: systemsOptions,
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

  // useEffect(() => {
  //   if (!projectToUpdate) return
  //   const client = clientsOptions?.find(
  //     (_client) => _client.label === projectToUpdate?.clientAlias
  //   )
  //   if (client) handleFormChange("client", client.value)
  // }, [])

  // useEffect(() => {
  //   if (!projectToUpdate) return
  //   const sector = sectorsOptions?.find(
  //     (_sector) => _sector.label === projectToUpdate?.sector
  //   )
  //   if (sector) handleFormChange("sector", sector.value)
  // }, [])

  // useEffect(() => {
  //   if (!projectToUpdate) return
  //   const user = usersOptions?.find((_user) => _user.label === projectToUpdate?.user)
  //   if (user) handleFormChange("focusPoint", user.value)
  // }, [])

  const inputRefObj = {
    input: <SimpleInput />,
    select: <InputSelect />,
    add_select: <AddSelect />
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
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
