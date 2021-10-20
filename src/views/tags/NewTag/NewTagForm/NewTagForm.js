import React, { useEffect, useState } from "react"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import useTagApi from "../../../../hooks/api/useTagApi"

export const NewTagForm = ({
  value,
  onChange,
  objectToUpdate,
  isProjectTag,
  onSupportClick,
  openAuxModal
}) => {
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
    return tags
      .filter((tag) => tag._id !== objectToUpdate?._id && !tag.parent)
      .map(({ name, _id }) => ({ label: name, value: _id }))
  }

  const formInputs = {
    name: {
      type: "text",
      config: {
        placeholder: "Tag",
        label: "Tag"
      }
    },
    relatedTag: {
      type: "select",
      config: {
        placeholder: "Padre",
        label: "Escriba el nombre del padre (opcional)",
        options: tagOptions,
        isDisabled: objectToUpdate?.relatedTags?.length > 0,
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal()
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

  useEffect(() => {
    if (!objectToUpdate || tagOptions.length === 0) return

    const tag = tagOptions.find(
      (_tag) => _tag.label === objectToUpdate?.parent?.name
    )

    handleFormChange("relatedTag", tag)
  }, [objectToUpdate, tagOptions])

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
          onClick: config.onHelperClick ? onSupportClick : null,
          ...config
        })
      })}
    </>
  )
}
