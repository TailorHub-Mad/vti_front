import { Checkbox, Switch } from "@chakra-ui/react"
import React from "react"
import { MOCK_SELECT_OPTIONS } from "../../../../../../mock/mock"
import { AddSelect } from "../../../../../forms/AddSelect/AddSelect"
import { InputSelect } from "../../../../../forms/InputSelect/InputSelect"

export const SimpleFilterForm = ({ openAuxModal, value, onChange }) => {
  const filterInputs = {
    project: {
      type: "select",
      config: {
        placeholder: "Alias proyecto",
        options: MOCK_SELECT_OPTIONS,
        label: "Proyecto",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal("project"),
      },
    },
    test_system: {
      type: "select",
      config: {
        placeholder: "Sistema",
        options: MOCK_SELECT_OPTIONS,
        label: "Sistema de ensayo",
      },
    },
    client: {
      type: "select",
      config: {
        placeholder: "Cliente",
        options: MOCK_SELECT_OPTIONS,
        label: "Cliente",
      },
    },
    dates: {
      type: "add_select",
      config: {
        placeholder: "Desde 00/00/0000 hasta 00/00/0000",
        options: MOCK_SELECT_OPTIONS,
        label: "Fechas",
        addItemLabel: "Añadir ",
        removeItemLabel: "Eliminar ",
      },
    },
    users: {
      type: "add_select",
      config: {
        placeholder: "Usuario",
        options: MOCK_SELECT_OPTIONS,
        label: "Usuarios",
        addItemLabel: "Añadir ",
        removeItemLabel: "Eliminar ",
      },
    },
    vti_code: {
      type: "add_select",
      config: {
        placeholder: "Código",
        options: MOCK_SELECT_OPTIONS,
        label: "Códigos VTI",
        addItemLabel: "Añadir ",
        removeItemLabel: "Añadir ",
      },
    },
    project_tags: {
      type: "add_select",
      config: {
        placeholder: "Proyecto",
        options: MOCK_SELECT_OPTIONS,
        label: "Tags de proyecto",
        addItemLabel: "Añadir ",
        removeItemLabel: "Eliminar ",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal("project_tags"),
      },
    },
    note_tags: {
      type: "add_select",
      config: {
        placeholder: "Tags de apunte",
        options: MOCK_SELECT_OPTIONS,
        label: "Tags de apunte",
        addItemLabel: "Añadir ",
        removeItemLabel: "Eliminar ",
        helper: "Abrir ventana de ayuda",
        onHelperClick: () => openAuxModal("note_tags"),
      },
    },
    only_suscribed: {
      type: "checkbox",
      config: {
        children: "Suscritos",
        marginBottom: "12px",
        display: "flex",
        variant: "filter",
      },
    },
    only_favs: {
      type: "checkbox",
      config: {
        children: "Favoritos",
        marginBottom: "12px",
        display: "flex",
        variant: "filter",
      },
    },
    only_unread: {
      type: "checkbox",
      config: {
        children: "No leídos",
        marginBottom: "24px",
        variant: "filter",
        display: "flex",
      },
    },
    with_links: {
      type: "switch",
      config: {
        children: "Adjunto Link No/Sí",
        marginBottom: "12px",
      },
    },
    formalized: {
      type: "switch",
      config: {
        children: "Formalizado No/Sí",
        marginBottom: "12px",
      },
    },
    closed: {
      type: "switch",
      config: {
        children: "Cerrado No/Sí",
        marginBottom: "12px",
      },
    },
    with_responses: {
      type: "switch",
      config: {
        children: "Con respuestas No/Sí",
      },
    },
  }

  const inputRefObj = {
    select: <InputSelect />,
    add_select: <AddSelect />,
    checkbox: <Checkbox />,
    switch: <Switch />,
  }

  const handleFilterChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value?.target?.checked ? _value.target.checked : _value,
    })
  }

  return (
    <>
      {Object.entries(filterInputs).map(([name, { type, config }]) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFilterChange(name, val),
          marginBottom: "24px",
          ...config,
        })
      })}
    </>
  )
}
