import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useClientApi from "../../../../hooks/api/useClientApi"
import useSectorApi from "../../../../hooks/api/useSectorApi"
import useUserApi from "../../../../hooks/api/useUserApi"
import { MOCK_SELECT_OPTIONS, MOCK_YEAR_OPTIONS } from "../../../../mock/mock"

export const NewProjectForm = ({ openAuxModal, value, onChange }) => {
  const { alias, client, sector, year, focusPoint } = value
  const { getClients } = useClientApi()
  const { getSectors } = useSectorApi()
  const { getUsers } = useUserApi()
  //Client
  const [clientsOpt, setClientsOpt] = useState([])
  const [sectorsOpt, setSectorsOpt] = useState([])
  const [usersOpt, setUsersOpt] = useState([])

  useEffect(() => {
    const fetchClients = async () => {
      const _clients = await getClients()
      const _clientsArr = _clients.map((cl) => ({ label: cl.alias, value: cl._id }))
      setClientsOpt(_clientsArr)
    }
    const fetchSectors = async () => {
      const _sectors = await getSectors()
      const _sectorsArr = _sectors.map((sc) => ({ label: sc.title, value: sc.id }))
      setSectorsOpt(_sectorsArr)
    }
    const fetchUsers = async () => {
      const _users = await getUsers()
      const _usersArr = _users.map((user) => ({ label: user.alias, value: user.id }))
      setUsersOpt(_usersArr)
    }
    fetchClients()
    fetchSectors()
    fetchUsers()
  }, [])

  // const checkIfDisabled = (value) => {
  //   const orderedValues = [
  //     "id",
  //     "alias",
  //     "client",
  //     "sector",
  //     "year",
  //     "focusPoint",
  //     "test_systems",
  //     "project_tags",
  //   ]
  //   const index = orderedValues.indexOf(value)
  //   const arrToCheck = [...orderedValues].slice(0,index)

  //   work in progress
  // }

  //Fetch clients, sectors, users, testSystems, projectTags
  //Si metemos el id el check de isDisabled debe empezar por id

  const filterInputs = {
    // id: {
    //   type: "input",
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
        options: clientsOpt,
        label: "Cliente",
        isDisabled: !alias,
      },
    },
    sector: {
      type: "select",
      config: {
        placeholder: "Sector",
        options: sectorsOpt,
        label: "Sector",
        isDisabled: !alias || !client,
      },
    },
    year: {
      type: "select",
      config: {
        placeholder: "2021",
        options: MOCK_YEAR_OPTIONS,
        label: "Año",
        isDisabled: !alias || !client || !sector,
      },
    },
    focusPoint: {
      type: "select",
      config: {
        placeholder: "Punto focal inicio",
        options: usersOpt || MOCK_SELECT_OPTIONS,
        label: "Punto focal inicio",
        isDisabled: !alias || !client || !sector || !year,
      },
    },

    test_systems: {
      type: "add_select",
      config: {
        placeholder: "Sistema de ensayo",
        options: MOCK_SELECT_OPTIONS,
        label: "Sistemas de ensayos",
        addItemLabel: "Añadir ",
        removeItemLabel: "Eliminar ",
        isDisabled: !alias || !client || !sector || !year || !focusPoint,
      },
    },

    project_tags: {
      type: "add_select",
      config: {
        placeholder: "Proyecto",
        options: MOCK_SELECT_OPTIONS,
        label: "Tags de proyecto",
        addItemLabel: "Añadir ",
        removeItemLabel: "Eliminar ",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal("project_tags"),
        isDisabled: !alias || !client || !sector || !year || !focusPoint,
      },
    },
  }

  const inputRefObj = {
    input: <SimpleInput />,
    select: <InputSelect />,
    add_select: <AddSelect />,
  }

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value?.target?.checked ? _value._target.checked : _value,
    })
  }

  return (
    <>
      {Object.entries(filterInputs).map(([name, { type, config }]) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: "24px",
          ...config,
        })
      })}
    </>
  )
}
