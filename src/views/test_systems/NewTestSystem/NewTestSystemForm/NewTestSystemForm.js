import React, { useEffect, useState } from "react"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useClientApi from "../../../../hooks/api/useClientApi"
import useCodeApi from "../../../../hooks/api/useCodeApi"

export const NewTestSystemForm = ({ value, onChange, objectToUpdate }) => {
  const { getClients } = useClientApi()
  const { getCodes } = useCodeApi()

  const [clientOptions, setClientOptions] = useState([])
  const [codeOptions, setCodeOptions] = useState([])

  const _values = { ...value }

  // const formatValues = !objectToUpdate
  //   ? { ...value }
  //   : {
  //       ...value,
  //       clientAlias: isObject
  //         ? value.clientAlias
  //         : { label: value.clientAlias, value: "" }
  //     }

  const formatClients = (_clients) =>
    _clients.map((cl) => ({ label: cl.alias, value: cl._id }))

  const formatCodes = (_codes) =>
    _codes.map((co) => ({ label: co.name, value: co._id }))

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    vtiCode: {
      type: "select",
      config: {
        placeholder: "Selecciona",
        label: "Código VTI",
        disabled: Boolean(objectToUpdate),
        options: codeOptions
      }
    },
    clientAlias: {
      type: "select",
      config: {
        placeholder: "Selecciona",
        label: "Cliente",
        disabled: Boolean(objectToUpdate),
        options: clientOptions
      }
    },
    alias: {
      type: "text",
      config: {
        placeholder: "Alias",
        label: "Alias"
      }
    },
    year: {
      type: "text",
      config: {
        placeholder: new Date().getFullYear(),
        label: "Año"
      }
    }
  }

  const inputRefObj = {
    text: <SimpleInput />,
    select: <InputSelect />
  }

  useEffect(() => {
    const _getClients = async () => {
      const clients = await getClients()
      setClientOptions(formatClients(clients))
    }
    const _getCodes = async () => {
      const codes = await getCodes()
      setCodeOptions(formatCodes(codes))
    }
    _getClients()
    _getCodes()
  }, [])

  useEffect(() => {
    if (!objectToUpdate || clientOptions.length === 0) return

    const client = clientOptions.find(
      (_client) => _client.label === objectToUpdate?.clientAlias
    )

    handleFormChange("clientAlias", client)
  }, [objectToUpdate, clientOptions])

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: _values[name],
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
