import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../../components/forms/AddSelect/AddSelect"
import { useRouter } from "next/router"
import useTagApi from "../../../../../hooks/api/useTagApi"
import { MultiTagSelect } from "../../../../../components/forms/MultiTagSelect/MultiTagSelect"

export const SimpleFilterForm = ({ openAuxModal, value, onChange }) => {
  const router = useRouter()
  const isProjectTag = router.query.type === "proyecto"
  const { getProjectTags, getNoteTags } = useTagApi()

  // Filter Options

  const [projectTagsOpt, setProjectTagsOpt] = useState(null)
  const [noteTagsOpt, setNoteTagsOpt] = useState(null)

  useEffect(() => {
    if (!projectTagsOpt) {
      const fetchProjectTags = async () => {
        const data = await getProjectTags()
        setProjectTagsOpt(
          data.map((ptag) => ({ label: ptag.name, value: ptag._id }))
        )
      }
      fetchProjectTags()
    }
  }, [projectTagsOpt])
  useEffect(() => {
    if (!noteTagsOpt) {
      const fetchNoteTags = async () => {
        const data = await getNoteTags()
        setNoteTagsOpt(data.map((ptag) => ({ label: ptag.name, value: ptag._id })))
      }
      fetchNoteTags()
    }
  }, [noteTagsOpt])

  const filterInputs = isProjectTag
    ? {
        project_tags: {
          type: "multitag_select",
          config: {
            placeholder: "Seleccione",
            options: projectTagsOpt,
            label: "Tags de proyecto",
            additemlabel: "Añadir ",
            removeitemlabel: "Eliminar ",
            helper: "Abrir ventana de ayuda",
            onHelperClick: () => openAuxModal("project_tags")
          }
        }
      }
    : {
        note_tags: {
          type: "multitag_select",
          config: {
            placeholder: "Seleccione",
            options: noteTagsOpt,
            label: "Tags de apunte",
            additemlabel: "Añadir ",
            removeitemlabel: "Eliminar ",
            helper: "Abrir ventana de ayuda",
            onHelperClick: () => openAuxModal("note_tags")
          }
        }
      }

  const inputRefObj = {
    add_select: <AddSelect />,
    multitag_select: <MultiTagSelect />
  }

  const handleFilterChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value?.target?.checked ? _value.target.checked : _value
    })
  }

  return (
    <>
      {Object.entries(filterInputs).map(([name, { type, config }], idx) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFilterChange(name, val),
          marginBottom: "24px",
          key: `${name}-${idx}`,
          ...config
        })
      })}
    </>
  )
}
