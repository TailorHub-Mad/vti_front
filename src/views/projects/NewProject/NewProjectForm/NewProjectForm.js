import React, { useEffect } from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useClientApi from "../../../../hooks/api/useClientApi"
import useSectorApi from "../../../../hooks/api/useSectorApi"
import useUserApi from "../../../../hooks/api/useUserApi"
import useSystemApi from "../../../../hooks/api/useSystemApi"
import useFetchSWR from "../../../../hooks/useFetchSWR"
import { MOCK_SELECT_OPTIONS, MOCK_YEAR_OPTIONS } from "../../../../mock/mock"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"

export const NewProjectForm = ({ openAuxModal, value, onChange, projectToEdit }) => {
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

  const formatSystems = (_systems) =>
    _systems.map((system) => ({ label: system.alias, value: system._id }))

  const clientsOptions = clients ? formatClients(clients) : []
  const sectorsOptions = sectors ? formatSectors(sectors) : []
  const usersOptions = users ? formatUsers(users) : []
  const systemsOptions = systems ? formatSystems(systems[0].testSystems) : []

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value,
    })
  }

  const formInputs = {
    // TODO -> autogenerate ID
    // id: {
    //   type: "text",
    //   config: {
    //     placeholder: "ID",
    //     label: "ID",
    //   },
    // },
    alias: {
      type: "input",
      config: {
        placeholder: "Alias",
        label: "Alias",
      },
    },
    client: {
      type: "select",
      config: {
        placeholder: "Cliente",
        options: clientsOptions,
        label: "Cliente",
      },
    },
    sector: {
      type: "select",
      config: {
        placeholder: "Sector",
        options: sectorsOptions,
        label: "Sector",
      },
    },
    year: {
      type: "select",
      config: {
        placeholder: "2021",
        options: MOCK_YEAR_OPTIONS,
        label: "Año",
      },
    },
    focusPoint: {
      type: "select",
      config: {
        placeholder: "Punto focal inicio",
        options: usersOptions,
        label: "Punto focal inicio",
      },
    },
    testSystems: {
      type: "add_select",
      config: {
        placeholder: "Sistemas de ensayo",
        options: systemsOptions,
        label: "Sistemas de ensayo",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
      },
    },

    tags: {
      type: "add_select",
      config: {
        placeholder: "Proyecto",
        options: MOCK_SELECT_OPTIONS,
        label: "Tags de proyecto",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal(),
        isDisabled: true, // TODO -> provisional
      },
    },
  }

  useEffect(() => {
    if (projectToEdit && clientsOptions?.length > 0) {
      const [cl] = clientsOptions.filter(
        (_client) => _client.label === projectToEdit?.clientAlias
      )
      handleFormChange("client", cl.value)
    }
  }, [clientsOptions])

  const inputRefObj = {
    input: <SimpleInput />,
    select: <InputSelect />,
    add_select: <AddSelect />,
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: "24px",
          isDisabled: index !== 0 && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config,
        })
      })}
    </>
  )
}
