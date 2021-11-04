import { Flex, Text, useMediaQuery } from "@chakra-ui/react"
import React, { useContext } from "react"
import { fetchType } from "../../../utils/constants/swr"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global"

const projectsMenuOptions = {
  all: {
    label: "Todos",
    value: fetchType.ALL,
    active_icon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  active: {
    label: "Activos",
    value: fetchType.ACTIVE,
    active_icon: ICONS_REFERENCE.active,
    icon: ICONS_REFERENCE.active
  },
  favs: {
    label: "Favoritos",
    value: fetchType.FAVS,
    active_icon: ICONS_REFERENCE.heart,
    icon: ICONS_REFERENCE.heart_line
  },
  subscribed: {
    label: "Suscritos",
    value: fetchType.SUBSCRIBED,
    active_icon: ICONS_REFERENCE.subscribe,
    icon: ICONS_REFERENCE.subscribe_line
  }
}

const projectsMenuOptionsAdmin = {
  all: {
    label: "Todos",
    value: fetchType.ALL,
    active_icon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  active: {
    label: "Activos",
    value: fetchType.ACTIVE,
    active_icon: ICONS_REFERENCE.active,
    icon: ICONS_REFERENCE.active
  },
  subscribed: {
    label: "Suscritos",
    value: fetchType.SUBSCRIBED,
    active_icon: ICONS_REFERENCE.subscribe,
    icon: ICONS_REFERENCE.subscribe_line
  }
}

export const ProjectsMenu = ({ fetchState, onChange }) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")
  const { role } = useContext(ApiAuthContext)

  const menu =
    role === RoleType.ADMIN ? projectsMenuOptionsAdmin : projectsMenuOptions

  return (
    <>
      <Flex mb="16px" ml={["0", null, null, "34px"]}>
        {Object.entries(menu).map(([name, item], idx) => {
          const isActive = name === fetchState

          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              role="group"
              onClick={() => onChange(item.value)}
              ml={idx !== 0 ? "16px" : "0"}
            >
              {item.icon ? (
                isActive ? (
                  <item.active_icon color="blue.500" />
                ) : (
                  <item.icon color="grey" _groupHover={{ color: "blue.500" }} />
                )
              ) : null}
              {isScreen || isActive ? (
                <Text
                  variant="d_s_medium"
                  _groupHover={{ color: "blue.500" }}
                  mt="4px"
                  color={isActive ? "blue.500" : "grey"}
                >
                  {item.label}
                </Text>
              ) : null}
            </Flex>
          )
        })}
      </Flex>
    </>
  )
}
