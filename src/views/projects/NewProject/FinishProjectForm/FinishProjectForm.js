import React, { useEffect, useState } from "react"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useUserApi from "../../../../hooks/api/useUserApi"

export const FinishProjectForm = ({ value, onChange }) => {
  const { getUsers } = useUserApi()

  const [userOptions, setUserOptions] = useState([])

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formatUsers = (_users) =>
    _users.map((user) => ({ label: user.alias, value: user._id }))

  const formInputs = {
    date: {
      type: "text",
      config: {
        type: "date",
        placeholder: "00/00/0000",
        label: "Fecha de cierre*"
      }
    },
    focusPoint: {
      type: "select",
      config: {
        placeholder: "Selecciona",
        label: "Punto focal de revisión",
        options: userOptions
      }
    }
  }

  useEffect(() => {
    const _getUsers = async () => {
      const users = await getUsers()
      setUserOptions(formatUsers(users))
    }

    _getUsers()
  }, [])

  const inputRefObj = {
    text: <SimpleInput />,
    select: <InputSelect />
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
