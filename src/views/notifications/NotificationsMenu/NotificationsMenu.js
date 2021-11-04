import { Flex, Text, useMediaQuery } from "@chakra-ui/react"
import React from "react"
import { fetchType } from "../../../utils/constants/swr"
import { SubscribeIcon } from "../../../components/icons/SubscribeIcon"
import { LockCloseIcon } from "../../../components/icons/LockCloseIcon"
import { PageLineIcon } from "../../../components/icons/PageLineIcon"
import { PinIcon } from "../../../components/icons/PinIcon"
import { FolderCloseIcon } from "../../../components/icons/FolderCloseIcon"
import { RevertIcon } from "../../../components/icons/RevertIcon"

const notesMenuOptions = {
  all: {
    label: "Todos",
    icon: <LockCloseIcon />
  },
  notes: {
    label: "Apuntes",
    icon: <PageLineIcon />
  },
  containers: {
    label: "Contenedores",
    icon: <FolderCloseIcon />
  },
  manteinance: {
    label: "Mantenimiento",
    icon: <SubscribeIcon />
  },
  behaviour: {
    label: "Comportamiento",
    icon: <RevertIcon />
  },
  fixed: {
    label: "Fijados",
    icon: <PinIcon />
  }
}

export const NotificationsMenu = ({
  fetchState = fetchType.ALL,
  notificationsCount = 0,
  onChange
}) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  return (
    <>
      <Flex>
        {Object.entries(notesMenuOptions).map(([name, item], idx) => {
          const { label } = item
          const isActive = name === fetchState
          const color = isActive ? "blue.500" : "grey"

          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              onClick={() => onChange(name)}
              ml={idx !== 0 ? "16px" : "0"}
            >
              {React.cloneElement(item.icon, {
                mr: "4px",
                width: "16px",
                height: "16px",
                color
              })}
              {isScreen || isActive ? (
                <Text variant="d_s_medium" mt="4px" color={color}>
                  {label}
                </Text>
              ) : null}
            </Flex>
          )
        })}
      </Flex>
      {isScreen ? (
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${notificationsCount} Notificaciones`}
        </Text>
      ) : null}
    </>
  )
}
