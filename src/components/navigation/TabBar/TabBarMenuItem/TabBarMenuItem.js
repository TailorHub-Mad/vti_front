import { Flex, Icon, Text, useBoolean } from "@chakra-ui/react"
import Link from "next/link"
import { PATHS } from "../../../../utils/constants/global"
import { ArrowDownIcon } from "../../../icons/ArrowDownIcon"

export const MenuLink = ({
  label,
  icon,
  href,
  submenu,
  setShowSubmenu,
  showSubmenu,
  disabled,
  noEvents,
  ...props
}) => {
  return (
    <Flex
      align="center"
      padding="8px 0"
      marginBottom={showSubmenu ? "0" : "16px"}
      w="100%"
      role="group"
      cursor={noEvents ? "default" : "pointer"}
      pointerEvents={disabled ? "none" : "auto"}
      opacity={disabled ? "0.3" : "1"}
      {...props}
    >
      <Link href={noEvents ? "" : href || PATHS.notes} passHref>
        <Flex>
          <Icon
            color="white"
            marginRight="8px"
            _groupHover={{ color: "yellow" }}
            pointerEvents={true}
          >
            {icon}
          </Icon>
          <Text
            color="white"
            variant="d_s_medium"
            _groupHover={{ color: "yellow" }}
            marginTop="3px"
          >
            {label}
          </Text>
        </Flex>
      </Link>

      {submenu ? (
        <ArrowDownIcon
          color="white"
          _groupHover={{ color: "yellow" }}
          onClick={setShowSubmenu.toggle}
          cursor="pointer"
        />
      ) : null}
    </Flex>
  )
}

export const MenuItem = ({
  label,
  icon,
  href,
  submenu,
  disabled,

  ...props
}) => {
  const [showSubmenu, setShowSubmenu] = useBoolean(false)
  return (
    <>
      <MenuLink
        label={label}
        icon={icon}
        href={href}
        submenu={submenu}
        setShowSubmenu={setShowSubmenu}
        showSubmenu={showSubmenu}
        disabled={disabled}
        {...props}
      />
      {submenu && showSubmenu
        ? submenu.map((link, idx) => (
            <MenuLink
              key={link.label}
              label={link.label}
              icon={link.icon()}
              href={link.href}
              disabled={disabled}
              pl="16px"
              mb={idx === submenu.length - 1 ? "16px" : "0"}
            />
          ))
        : null}
    </>
  )
}
