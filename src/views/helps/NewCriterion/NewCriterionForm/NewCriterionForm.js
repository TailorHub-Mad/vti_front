import React, { useEffect, useState } from "react"
import { MultiTagSelect } from "../../../../components/forms/MultiTagSelect/MultiTagSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useTagApi from "../../../../hooks/api/useTagApi"

export const NewCriterionForm = ({ value, onChange, isProject, editOnlyTags }) => {
  const { getProjectTags, getNoteTags } = useTagApi()

  const [tagOptions, setTagOptions] = useState([])

  const _values = { ...value }

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
    title: {
      type: "text",
      config: {
        placeholder: "Nombre*",
        label: "Nombre del criterio*",
        disabled: editOnlyTags
      }
    },
    group_title: {
      type: "text",
      config: {
        placeholder: "Escriba",
        label: "Título*",
        disabled: editOnlyTags
      }
    },
    relatedTags: {
      type: "select",
      config: {
        placeholder: "Seleccione",
        label: "Tag*",
        options: tagOptions
      }
    }
  }

  const inputRefObj = {
    text: <SimpleInput />,
    select: <MultiTagSelect />
  }

  useEffect(() => {
    const _getTags = async () => {
      const tags = isProject ? await getProjectTags() : await getNoteTags()
      const availableTags =
        _values?.relatedTags?.length > 0
          ? tags.filter(
              (t) => !_values.relatedTags.map((v) => v.value).includes(t._id)
            )
          : tags
      setTagOptions(formatTags(availableTags))
    }
    _getTags()
  }, [isProject])

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
