import React, { useEffect, useState } from "react"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useTagApi from "../../../../hooks/api/useTagApi"

export const NewTagForm = ({ value, onChange, isProjectTag }) => {
  const [tagOptions, setTagOptions] = useState([])
  const { getProjectTags, getNoteTags } = useTagApi()

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formatTags = (tags) => {
    return tags.map(({ name, _id }) => ({ label: name, value: _id }))
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
    name: {
      type: "text",
      config: {
        placeholder: "Tag",
        label: "Tag"
      }
    },
    parent: {
      type: "select",
      config: {
        placeholder: "Padre",
        label: "Escriba el nombre del padre (opcional)",
        options: tagOptions
      }
    }
  }

  const inputRefObj = {
    text: <SimpleInput />,
    select: <InputSelect />
  }

  useEffect(() => {
    const _getTags = async () => {
      const tags = isProjectTag ? await getProjectTags() : await getNoteTags()
      setTagOptions(formatTags(tags))
    }
    _getTags()
  }, [])

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: "24px",
          isDisabled: index !== 0 && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}
