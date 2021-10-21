import React, { useEffect, useState } from "react"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useDepartmentApi from "../../../../hooks/api/useDepartmentApi"

export const NewUserForm = ({ value, onChange, objectToUpdate }) => {
  const { getDepartments } = useDepartmentApi()

  const [departmentOptions, setDepartmentOptions] = useState([])

  const _values = { ...value }

  const formatDepartments = (departments) =>
    departments.map((d) => ({ label: d.name, value: d._id }))

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
        label: "Alias*"
      }
    },
    name: {
      type: "text",
      config: {
        placeholder: "Escribe tu nombre",
        label: "Nombre*"
      }
    },
    email: {
      type: "text",
      config: {
        placeholder: "Escribe tu email",
        label: "Email*",
        disabled: Boolean(objectToUpdate)
      }
    },
    department: {
      type: "select",
      config: {
        placeholder: "Selecciona",
        label: "Departamento*",
        options: departmentOptions
      }
    }
  }

  const inputRefObj = {
    text: <SimpleInput />,
    select: <InputSelect />
  }

  useEffect(() => {
    const _getClients = async () => {
      const departments = await getDepartments()
      setDepartmentOptions(formatDepartments(departments))
    }
    _getClients()
  }, [])

  useEffect(() => {
    if (!objectToUpdate || departmentOptions.length === 0) return

    const department = departmentOptions.find(
      (_department) => _department.label === objectToUpdate?.department?.name
    )

    handleFormChange("department", department)
  }, [objectToUpdate, departmentOptions])

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
