import React from "react"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useClientApi from "../../../../hooks/api/useClientApi"
import useFetchSWR from "../../../../hooks/useFetchSWR"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"

export const NewTestSystemForm = ({ value, onChange, systemToUpdate }) => {
  const { getClients } = useClientApi()
  // TODO -> manage errors & loading state
  const { data } = useFetchSWR(SWR_CACHE_KEYS.clients, getClients)

  const formatClients = (_clients) =>
    _clients.map((cl) => ({ label: cl.alias, value: cl._id }))

  const clientsOptions = data ? formatClients(data) : []

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
    vtiCode: {
      type: "text",
      config: {
        placeholder: "Cod",
        label: "Cod VTI*",
        disabled: Boolean(!systemToUpdate),
      },
    },
    clientAlias: {
      type: "select",
      config: {
        placeholder: "AliasCL",
        label: "Cliente*",
        options: clientsOptions,
        disabled: Boolean(!systemToUpdate),
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
        placeholder: new Date().getFullYear(),
        label: "Año*",
      },
    },
  }

  const inputRefObj = {
    text: <SimpleInput />,
    select: <InputSelect />,
  }

  // useEffect(() => {
  //   if (systemToUpdate && clientsOptions?.length > 0) {
  //     const [cl] = clientsOptions.filter(
  //       (_client) => _client.label === systemToUpdate?.clientAlias
  //     )
  //     handleFormChange("client", cl.value)
  //   }
  // }, [clientsOptions])

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: name === "name" ? "0" : "24px",
          isDisabled:
            config.disabled ||
            (index !== 0 && !value[Object.keys(value)[index - 1]]),
          key: `${name}-${index}`,
          ...config,
        })
      })}
    </>
  )
}
