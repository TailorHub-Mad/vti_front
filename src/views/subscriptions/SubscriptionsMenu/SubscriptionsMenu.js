import { DeleteIcon } from "@chakra-ui/icons"
import { Checkbox, Flex, Text, useMediaQuery, Box } from "@chakra-ui/react"
import React, { useContext } from "react"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global"
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
  }
}

export const SubscriptionsMenu = ({
  currentState,
  subscriptionsCount = 0,
  onChange,
  handleSelectAllRows,
  isChecked,
  onDelete,
  selectedRows,
  noCheck
}) => {
  const { role } = useContext(ApiAuthContext)
  const [isScreen] = useMediaQuery("(min-width: 475px)")

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
  return isScreen ? (
    <>
      <Flex alignItems="center" gridGap="16px">
        {role === RoleType.ADMIN || (
          <Flex alignItems="center" gridGap="6px">
            <Checkbox
              onChange={handleSelectAllRows}
              isChecked={isChecked}
              isDisabled={noCheck}
            />

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
        )}

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
              role="group"
              onClick={() => onChange(name)}
            >
              <Icon mr="4px" color={color} _groupHover={{ color: "blue.500" }} />
              {isScreen || isActive ? (
                <Text
                  variant="d_s_medium"
                  mt="4px"
                  color={color}
                  _groupHover={{ color: "blue.500" }}
                >
                  {label}
                </Text>
              ) : null}
            </Flex>
          )
        })}
      </Flex>
      <Text color="#C9C9C9" variant="d_s_medium">
        {`${subscriptionsCount} ${handleLabel()}`}
      </Text>
    </>
  ) : (
    <Box width="100%" pr="16px">
      <Flex alignItems="center" gridGap="16px">
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
              role="group"
              onClick={() => onChange(name)}
            >
              <Icon mr="4px" color={color} _groupHover={{ color: "blue.500" }} />
              {isScreen || isActive ? (
                <Text
                  variant="d_s_medium"
                  mt="4px"
                  color={color}
                  _groupHover={{ color: "blue.500" }}
                >
                  {label}
                </Text>
              ) : null}
            </Flex>
          )
        })}
      </Flex>

      <Flex justify="space-between" alignItems="center" gridGap="16px" mt="16px">
        {role === RoleType.ADMIN || (
          <Flex alignItems="center" gridGap="6px">
            <Checkbox
              onChange={handleSelectAllRows}
              isChecked={isChecked}
              isDisabled={noCheck}
            />

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
        )}
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${subscriptionsCount} ${handleLabel()}`}
        </Text>
      </Flex>
    </Box>
  )
}
