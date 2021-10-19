import { DeleteIcon } from "@chakra-ui/icons"
import { Checkbox, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"

const notesMenuOptions = {
  projects: {
    label: "Proyectos",
    activeIcon: ICONS_REFERENCE.project_line,
    icon: ICONS_REFERENCE.project_line
  },
  notes: {
    label: "Apuntes",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  testSystems: {
    label: "Sistemas de ensayo",
    activeIcon: ICONS_REFERENCE.subscribe,
    icon: ICONS_REFERENCE.subscribe_line
  },
  tags: {
    label: "Tags",
    activeIcon: ICONS_REFERENCE.tag_link,
    icon: ICONS_REFERENCE.tag_line
  }
}

export const SubscriptionsMenu = ({
  currentState,
  subscriptionsCount = 0,
  onChange,
  handleSelectAllRows,
  isChecked,
  onDelete,
  selectedRows
}) => {
  const handleLabel = () => {
    switch (currentState) {
      case "projects":
        return "Proyectos"
      case "notes":
        return "Apuntes"
      case "testSystems":
        return "Sistemas"
      case "tags":
        return "Tags"
    }
  }

  return (
    <>
      <Flex alignItems="center" gridGap="16px">
        <Flex alignItems="center" gridGap="6px">
          <Checkbox onChange={handleSelectAllRows} isChecked={isChecked} />
          {Object.keys(selectedRows).length > 0 && (
            <Flex
              alignItems="center"
              justifyContent="center"
              onClick={onDelete}
              cursor="pointer"
              gridGap="6px"
            >
              <DeleteIcon color="error" cursor="pointer" />
              <Text color="error" marginTop="6px" cursor="pointer">
                Eliminar
              </Text>
            </Flex>
          )}
        </Flex>

        {Object.entries(notesMenuOptions).map(([name, item]) => {
          const { icon, activeIcon, label } = item
          const isActive = name === currentState
          const color = isActive ? "blue.500" : "grey"
          const Icon = isActive ? activeIcon : icon

          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              onClick={() => onChange(name)}
            >
              <Icon mr="4px" color={color} />
              <Text variant="d_s_medium" mt="4px" color={color}>
                {label}
              </Text>
            </Flex>
          )
        })}
      </Flex>
      <Text color="#C9C9C9" variant="d_s_medium">
        {`${subscriptionsCount} ${handleLabel()}`}
      </Text>
    </>
  )
}
