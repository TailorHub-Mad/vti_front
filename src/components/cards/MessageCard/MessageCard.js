import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Circle, Tag, Text, useOutsideClick } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { AttachmentIcon } from "../../icons/attachmentIcon"
import { BadgeIcon } from "../../icons/BadgeIcon"
import { HeartIcon } from "../../icons/HeartIcon"
import { LockCloseIcon } from "../../icons/LockCloseIcon"
import { LockOpenIcon } from "../../icons/LockOpenIcon"
import { MessagesIcon } from "../../icons/messagesIcon"
import { OptionsIcon } from "../../icons/OptionsIcon"
import { SubscribeIcon } from "../../icons/SubscribeIcon"
import { Card } from "../../layout/Card/Card"

export const MessageCard = ({
  isFavourite = true,
  isClosed,
  isUnread,
  canSusbscribe = true,
  ...props
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const ref = useRef(null)
  useOutsideClick({
    ref: ref,
    handler: () => setShowOptions(false),
  })
  return (
    <Card {...props}>
      <Box display="flex" height="32px" justifyContent="space-between">
        <Box display="flex" maxWidth="80%" height="32px">
          {isFavourite ? (
            <HeartIcon color="error" width="16px" height="16px" marginRight="4px" />
          ) : null}
          <Text marginTop="2px" variant="d_s_medium" noOfLines={2}>
            Titulo M0
          </Text>
        </Box>
        <Box position="relative">
          <OptionsIcon
            width="16px"
            height="16px"
            color="grey"
            cursor="pointer"
            onClick={() => setShowOptions(true)}
          />
          {showOptions ? (
            <Box
              position="absolute"
              top="-22px"
              right="24px"
              bgColor="white"
              ref={ref}
              borderRadius="2px"
              boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
              width="94px"
              height="64px"
            >
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                height="32px"
                borderBottom="1px solid"
                borderColor="blue"
                cursor="pointer"
                padding="8px"
                _hover={{
                  opacity: "0.8",
                }}
              >
                <HeartIcon
                  width="16px"
                  height="16px"
                  marginRight="4px"
                  color="blue"
                  onClick={() => setShowOptions(true)}
                />
                <Text variant="d_xs_regular" marginRight="2px">
                  Favorito
                </Text>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                height="32px"
                borderColor="blue"
                cursor="pointer"
                padding="8px"
                _hover={{
                  opacity: "0.8",
                }}
              >
                <DeleteIcon
                  width="16px"
                  height="16px"
                  marginRight="4px"
                  color="error"
                  onClick={() => setShowOptions(true)}
                />
                <Text variant="d_xs_regular" color="error" marginRight="2px">
                  Eliminar
                </Text>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Box display="flex" color="grey" marginBottom="18px" marginTop="6px">
        <Text variant="d_xs_regular">ID001</Text>
        <Text variant="d_xs_regular" marginLeft="10px">
          Autor
        </Text>
        <Text variant="d_xs_regular" marginLeft="10px">
          ult. actualización 15/02/2021
        </Text>
      </Box>
      <Box display="grid" gridRowGap="8px" gridTemplateColumns="100%" width="100%">
        <Box display="flex" alignItems="center">
          <Tag variant="project">Proyecto</Tag>
        </Box>
        <Box display="flex" alignItems="center">
          <Tag variant="testSystem" marginRight="8px">
            <Text isTruncated>Sistema de ensayo</Text>
          </Tag>
          <Tag variant="testSystem" marginRight="8px">
            <Text isTruncated>Sistema de ensayo</Text>
          </Tag>
          <Tag variant="testSystem">+1</Tag>
        </Box>
        <Box display="flex" alignItems="center">
          <Tag variant="note" marginRight="8px">
            <Text isTruncated>Tag de nota</Text>
          </Tag>
          <Tag variant="note" marginRight="8px">
            <Text isTruncated>Tag de nota</Text>
          </Tag>
          <Tag variant="note" marginRight="8px">
            Tag
          </Tag>
          <Tag variant="note">+2</Tag>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        height="24px"
        alignItems="center"
        marginTop="16px"
      >
        {isClosed ? (
          <LockOpenIcon
            width="16px"
            height="16px"
            color="grey"
            cursor="pointer"
            onClick={() => setShowOptions(true)}
          />
        ) : (
          <LockCloseIcon
            width="16px"
            height="16px"
            color="grey"
            cursor="pointer"
            onClick={() => setShowOptions(true)}
          />
        )}
        <BadgeIcon
          width="16px"
          height="16px"
          color="grey"
          cursor="pointer"
          onClick={() => setShowOptions(true)}
        />
        {canSusbscribe ? (
          <SubscribeIcon
            width="16px"
            height="16px"
            color="grey"
            cursor="pointer"
            onClick={() => setShowOptions(true)}
          />
        ) : null}
        <Box display="flex" alignItems="center">
          <Text color="grey" variant="d_xs_regular" marginRight="2px">
            4
          </Text>
          <MessagesIcon
            width="16px"
            height="16px"
            color="grey"
            cursor="pointer"
            onClick={() => setShowOptions(true)}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <Text color="grey" variant="d_xs_regular" marginRight="2px">
            1
          </Text>
          <AttachmentIcon
            width="16px"
            height="16px"
            color="grey"
            cursor="pointer"
            onClick={() => setShowOptions(true)}
          />
        </Box>
        <Box w="42px" h="24px" position="relative">
          <Circle size="24px" position="absolute" top="0" right="0" bg="blue_alt">
            <Text color="white" transform="uppercase" variant="d_xs_regular">
              +5
            </Text>
          </Circle>
          <Circle
            size="24px"
            position="absolute"
            top="0"
            left="0"
            zIndex="1"
            bg="blue"
          >
            <Text color="white" transform="uppercase" variant="d_xs_regular">
              PL
            </Text>
          </Circle>
        </Box>
      </Box>
    </Card>
  )
}
