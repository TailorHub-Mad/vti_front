import React from "react"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useClientApi from "../../../../hooks/api/useClientApi"
import useFetchSWR from "../../../../hooks/useFetchSWR"

export const NewTestSystemForm = ({ value, onChange }) => {
  const { getClients } = useClientApi()
  // TODO -> manage errors & loading state
  const { data /*error, isLoading*/ } = useFetchSWR("clients/", getClients)

  const handleOptinsList = () => {
    if (!data) return []

    return data.map((client) => {
      return {
        value: client._id,
        label: client.alias,
      }
    })
  }

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value,
    })
  }

  const currentYear = new Date().getFullYear()
  const formInputs = {
    // TODO -> autogenerate ID
    // id: {
    //   type: "text",
    //   config: {
    //     placeholder: "ID",
    //     label: "ID",
    //   },
    // },
    vtiCode: {
      type: "text",
      config: {
        placeholder: "Cod",
        label: "Cod VTI*",
      },
    },
    clientAlias: {
      select: true,
      type: "text",
      config: {
        placeholder: "AliasCL",
        label: "Cliente*",
      },
    },
    alias: {
      type: "text",
      config: {
        placeholder: "Alias",
        label: "Alias*",
      },
    },
    year: {
      type: "text",
      config: {
        placeholder: currentYear,
        label: "Año*",
      },
    },
  }

  const inputRefObj = {
    text: <SimpleInput />,
  }

  const seelctInputRefObj = {
    text: <InputSelect options={handleOptinsList()} />,
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config, select }], index) => {
        const objToClone = select ? seelctInputRefObj : inputRefObj
        return React.cloneElement(objToClone[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: name === "name" ? "0" : "24px",
          isDisabled: index !== 0 && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config,
        })
      })}
    </>
  )
}
