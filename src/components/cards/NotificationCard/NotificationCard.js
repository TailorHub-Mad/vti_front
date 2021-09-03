import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { BLINK_ANIMATION } from "../../../theme/animations/animations"
import { DeleteIcon } from "../../icons/DeleteIcon"
import { EventNotificationIcon } from "../../icons/EventNotificationIcon"
import { PinIcon } from "../../icons/PinIcon"
import { Card } from "../../layout/Card/Card"

export const NotificationCard = ({ onPin, onDelete, ...props }) => {
  //TODO recibir name, desc, tipo de notification por props y modal de confirmación de delete
  return (
    <Card width={["100%", null, null, "428px"]} bgColor="white" {...props}>
      <Flex justify="space-between" marginBottom="12px">
        <Flex alignItems="center">
          <EventNotificationIcon
            color="error"
            width="24px"
            height="24px"
            css={BLINK_ANIMATION}
          />
          <Text variant="d_s_medium" lineHeight="100%">
            María Losada
          </Text>
        </Flex>
        <Flex alignItems="center">
          <PinIcon
            width="16px"
            height="16px"
            color="grey"
            cursor="pointer"
            onClick={onPin}
          />
          <DeleteIcon
            width="16px"
            height="16px"
            color="grey"
            cursor="pointer"
            onDelete={onDelete}
          />
        </Flex>
      </Flex>
      <Text variant="d_s_regular" marginBottom="8px">
        El apunte Título M02 del proyecto AliasPR ha sido aprobado
      </Text>
      <Text variant="d_xs_regular" color="start">
        Tipo de notificación
      </Text>
    </Card>
  )
}
