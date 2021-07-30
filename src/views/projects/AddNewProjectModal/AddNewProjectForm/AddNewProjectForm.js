import React from "react"
import { AddSelect } from "../../../../components/forms/AddSelect/AddSelect"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import { MOCK_SELECT_OPTIONS, MOCK_YEAR_OPTIONS } from "../../../../mock/mock"

export const AddNewProjectForm = ({ openAuxModal, value, onChange }) => {
  const {
    id,
    alias,
    client,
    sector,
    year,
    start_focal_point,
  } = value
  // const checkIfDisabled = (value) => {
  //   const orderedValues = [
  //     "id",
  //     "alias",
  //     "client",
  //     "sector",
  //     "year",
  //     "start_focal_point",
  //     "test_systems",
  //     "project_tags",
  //   ]
  //   const index = orderedValues.indexOf(value)
  //   const arrToCheck = [...orderedValues].slice(0,index)

  //   work in progress
  // }

  const filterInputs = {
    id: {
      type: "input",
      config: {
        placeholder: "ID",
        label: "ID",
      },
    },
    alias: {
      type: "input",
      config: {
        placeholder: "Alias",
        label: "Alias",
        isDisabled: !id,
      },
    },
    client: {
      type: "select",
      config: {
        placeholder: "Cliente",
        options: MOCK_SELECT_OPTIONS,
        label: "Cliente",
        isDisabled: !id || !alias,
      },
    },
    sector: {
      type: "select",
      config: {
        placeholder: "Sector",
        options: MOCK_SELECT_OPTIONS,
        label: "Sector",
        isDisabled: !id || !alias || !client,
      },
    },
    year: {
      type: "select",
      config: {
        placeholder: "2021",
        options: MOCK_YEAR_OPTIONS,
        label: "Año",
        isDisabled: !id || !alias || !client || !sector,
      },
    },
    start_focal_point: {
      type: "select",
      config: {
        placeholder: "Punto focal inicio",
        options: MOCK_SELECT_OPTIONS,
        label: "Punto focal inicio",
        isDisabled:
          !id || !alias || !client || !sector || !year,
      },
    },

    test_systems: {
      type: "add_select",
      config: {
        placeholder: "Sistema de ensayo",
        options: MOCK_SELECT_OPTIONS,
        label: "Sistemas de ensayos",
        addItemLabel: "Añadir ",
        removeItemLabel: "Eliminar ",
        isDisabled:
          !id ||
          !alias ||
          !client ||
          !sector ||
          !year ||
          !start_focal_point,
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
        isDisabled:
          !id ||
          !alias ||
          !client ||
          !sector ||
          !year ||
          !start_focal_point,
      },
    },
  }

  const inputRefObj = {
    input: <SimpleInput />,
    select: <InputSelect />,
    add_select: <AddSelect />,
  }

  const handleFormChange = (input, _value) => {
    console.log("CHANGE", input, _value)
    onChange({
      ...value,
      [input]: _value?.target?.checked ? _target.checked : _value,
    })
  }

  return (
    <>
      {Object.entries(filterInputs).map(([name, { type, config }]) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: "24px",
          ...config,
        })
      })}
    </>
  )
}
