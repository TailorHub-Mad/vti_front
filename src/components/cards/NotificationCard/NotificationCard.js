import { Flex, Text, Box } from "@chakra-ui/react"
import React from "react"
import { BLINK_ANIMATION } from "../../../theme/animations/animations"
import { DeleteIcon } from "../../icons/DeleteIcon"
import { EventNotificationIcon } from "../../icons/EventNotificationIcon"
import { PinIcon } from "../../icons/PinIcon"
import { Card } from "../../cards/Card"
import { LinkItemSpan } from "../../navigation/LinkItem/LinkItem"
import { ArrowBackIcon } from "@chakra-ui/icons"

export const NotificationCard = ({ notification, onPin, onDelete, ...props }) => {
  const { unRead, pin, description, urls, deleteTime } = notification

  const formatDescription = () => {
    if (!description) return

    let cont = 0
    const splitChain = description.split(" ")
    const formatChain = splitChain.map((c) => {
      if (!c.match(/\*(.*)\*/g)) return c
      const link = urls[cont]
      return link
    })
    return formatChain
  }

  const handleLinkRef = (element) => {
    const { id, model } = element

    switch (model) {
      case "projects":
        return `proyectos/${id}`
      case "notes":
        return `proyectos/${id}`
      case "testSytems":
        return `sistemas/${id}`
      case "tagProjects":
        return `tags/proyectos/${id}`
      case "tagNotes":
        return `tag/apunte/${id}`
      default:
        return ""
    }
  }

  const handleOnClickRevert = (id) => {
    id
  }

  return (
    <>
      {deleteTime ? (
        <Card
          key={`${notification._id}`}
          width={["100%", null, null, "428px"]}
          height="56px"
          bgColor="white"
          mt="55px"
          cursor="pointer"
          onClick={() => handleOnClickRevert(notification._id)}
          {...props}
        >
          <Flex alignItems="center">
            <ArrowBackIcon color="red" width="32px" height="24px" />
            <Text variant="d_m_medium" lineHeight="100%" color="error">
              Deshacer borrado
            </Text>
          </Flex>
        </Card>
      ) : (
        <Card width={["100%", null, null, "428px"]} bgColor="white" {...props}>
          <Flex justify="space-between" marginBottom="12px">
            <Flex alignItems="center">
              {!unRead && (
                <EventNotificationIcon
                  width="24px"
                  height="28px"
                  pb="4px"
                  color="error"
                  css={BLINK_ANIMATION}
                />
              )}
              <Text
                pt={unRead ? "none" : "6px"}
                pb={unRead ? "none" : "6px"}
                variant="d_s_medium"
              >
                {notification?.owner}
              </Text>
            </Flex>
            <Flex alignItems="center">
              <PinIcon
                width="16px"
                height="16px"
                color={pin ? "blue.500" : "grey"}
                cursor="pointer"
                onClick={() => onPin(notification._id)}
                transform={pin ? "rotate(-45deg)" : "none"}
              />
              <DeleteIcon
                width="16px"
                height="16px"
                color="grey"
                cursor="pointer"
                _hover={{
                  color: "red"
                }}
                onClick={() => onDelete(notification._id)}
              />
            </Flex>
          </Flex>
          <Box>
            {formatDescription().map((e, idx) => {
              if (e?.label) {
                return (
                  <LinkItemSpan
                    key={`${e.id}-${idx}`}
                    href={handleLinkRef(e)}
                    style={{ textDecoration: "underline" }}
                  >
                    {`${e.label.toUpperCase()}`}
                  </LinkItemSpan>
                )
              }
              return (
                <Text
                  display="inline"
                  variant="d_s_regular"
                  marginBottom="8px"
                  key={`${e.id}-${idx}`}
                >
                  {" "}
                  {e}{" "}
                </Text>
              )
            })}
          </Box>
          <Text variant="d_xs_regular" color="start" mt="16px">
            {notification?.type}
          </Text>
        </Card>
      )}
    </>
  )
}
