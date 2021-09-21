import React from "react"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useDepartmentApi from "../../../../hooks/api/useDepartmentApi"
import useFetchSWR from "../../../../hooks/useFetchSWR"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"

export const NewUserForm = ({ value, onChange }) => {
  const { getDepartments } = useDepartmentApi()
  // TODO -> manage errors & loading state
  const { data } = useFetchSWR(SWR_CACHE_KEYS.department, getDepartments)

  const formatDepartmentData = (_departments) =>
    _departments.map((cl) => ({ label: cl.name, value: cl._id }))

  const departmentsOptions = data ? formatDepartmentData(data) : []

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
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
      type: "text",
      config: {
        placeholder: "Alias",
        label: "Alias"
      }
    },
    fullName: {
      type: "text",
      config: {
        placeholder: "Carlos Gutiérrez",
        label: "Nombre"
      }
    },
    email: {
      type: "text",
      config: {
        placeholder: "cg@@vtisl.com",
        label: "Email"
      }
    },
    department: {
      type: "select",
      config: {
        placeholder: "Ingeniero",
        label: "Selecciona departamementos",
        options: departmentsOptions
      }
    }
  }

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
          marginBottom: name === "name" ? "0" : "24px",
          isDisabled: index !== 0 && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}
