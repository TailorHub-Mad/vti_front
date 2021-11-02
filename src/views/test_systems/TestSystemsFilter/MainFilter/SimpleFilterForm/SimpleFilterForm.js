import React, { useEffect, useState } from "react"
import { AddSelect } from "../../../../../components/forms/AddSelect/AddSelect"
import useClientApi from "../../../../../hooks/api/useClientApi"
import useTagApi from "../../../../../hooks/api/useTagApi"
import useSectorApi from "../../../../../hooks/api/useSectorApi"
import { MultiTagSelect } from "../../../../../components/forms/MultiTagSelect/MultiTagSelect"
import useCodeApi from "../../../../../hooks/api/useCodeApi"

export const SimpleFilterForm = ({ openAuxModal, value, onChange, isReset }) => {
  const { getClients } = useClientApi()
  const { getSectors } = useSectorApi()
  const { getProjectTags } = useTagApi()
  const { getCodes } = useCodeApi()

  // Filter Options
  const [clientsOpt, setClientsOpt] = useState(null)
  const [vtiCodesOpt, setVtiCodesOpt] = useState(null)
  const [projectTagsOpt, setProjectTagsOpt] = useState(null)
  const [sectorsOpt, setSectorOpt] = useState(null)

  useEffect(() => {
    if (!vtiCodesOpt) {
      const fetchTestSystems = async () => {
        const dataCodes = await getCodes()
        setVtiCodesOpt(dataCodes.map((c) => ({ label: c.name, value: c._id })))
      }
      fetchTestSystems()
    }
  }, [vtiCodesOpt])

  useEffect(() => {
    if (!clientsOpt) {
      const fetchClients = async () => {
        const data = await getClients()
        setClientsOpt(data.map((cl) => ({ label: cl.alias, value: cl.alias })))
      }
      fetchClients()
    }
  }, [clientsOpt])
  useEffect(() => {
    if (!sectorsOpt) {
      const fetchSectors = async () => {
        const data = await getSectors()
        setSectorOpt(data.map((sc) => ({ label: sc.title, value: sc._id })))
      }
      fetchSectors()
    }
  }, [sectorsOpt])

  useEffect(() => {
    if (!projectTagsOpt) {
      const fetchNoteTags = async () => {
        const data = await getProjectTags()
        setProjectTagsOpt(data.map((ptag) => ({ label: ptag.name, value: ptag.id })))
      }
      fetchNoteTags()
    }
  }, [projectTagsOpt])

  const filterInputs = {
    client: {
      type: "add_select",
      config: {
        placeholder: "Cliente",
        options: clientsOpt,
        label: "Cliente"
      }
    },
    year: {
      type: "add_select",
      config: {
        placeholder: "Año",
        options: new Array(50).fill("").map((_, idx) => {
          const year = new Date().getFullYear() - idx
          return { label: year, value: year }
        }),
        label: "Año"
      }
    },
    vti_code: {
      type: "add_select",
      config: {
        placeholder: "Código",
        options: vtiCodesOpt,
        label: "Códigos VTI",
        additemlabel: "Añadir ",
        removeitemlabel: "Añadir "
      }
    },
    sector: {
      type: "add_select",
      config: {
        placeholder: "Sector",
        options: sectorsOpt,
        label: "Sector"
      }
    },
    project_tags: {
      type: "multitag_select",
      config: {
        placeholder: "Proyecto",
        options: projectTagsOpt,
        label: "Tags de proyecto",
        additemlabel: "Añadir ",
        removeitemlabel: "Eliminar ",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal("project_tags")
      }
    }
  }

  const inputRefObj = {
    add_select: <AddSelect isReset={isReset} />,
    multitag_select: <MultiTagSelect isReset={isReset} />
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
