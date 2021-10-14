import { Flex, Icon, Text } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { PATHS } from "../../../../utils/constants/global"
import { ArrowDownIcon } from "../../../icons/ArrowDownIcon"

export const MenuItem = ({ label, icon, href, submenu, disabled, ...props }) => {
  const [showSubmenu, setShowSubmenu] = useState(false)
  const [active, setActive] = useState({
    state: false,
    submenu: false,
    position: null
  })

  const router = useRouter()
  const { asPath } = router

  const compare = (href) => !asPath.localeCompare(href)

  useEffect(() => {
    if (href && submenu) {
      const noSubmenuHref = submenu.find((sm, idx) => {
        if (compare(sm.href)) {
          setActive({
            state: true,
            submenu: true,
            position: idx
          })

          setShowSubmenu(true)
          return true
        }
        return false
      })

      if (!noSubmenuHref) {
        if (compare(href)) {
          setActive({
            state: true,
            submenu: false,
            position: null
          })
        }
      }
    } else if (submenu) {
      submenu.forEach((sm, idx) => {
        if (compare(sm.href)) {
          setActive({
            state: true,
            submenu: true,
            position: idx
          })
          setShowSubmenu(true)
        }
      })
    } else {
      compare(href)
        ? setActive({
            state: true
          })
        : null
    }
  }, [])

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
        active={active?.state && !active?.submenu}
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
              active={active?.state && active?.submenu && active?.position === idx}
              mb={idx === submenu.length - 1 ? "16px" : "0"}
            />
          ))
        : null}
    </>
  )
}

export const MenuLink = ({
  label,
  icon,
  href,
  submenu,
  setShowSubmenu,
  showSubmenu,
  disabled,
  noEvents,
  active = false,
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
        <Flex alignItems="center">
          <Icon
            color={active ? "#F3D30C" : "white"}
            marginRight="8px"
            _groupHover={{ color: "yellow" }}
            pointerEvents={true}
          >
            {icon}
          </Icon>
          <Text
            color={active ? "#F3D30C" : "white"}
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
          color={active ? "#F3D30C" : "white"}
          _groupHover={{ color: "yellow" }}
          onClick={() => setShowSubmenu(!showSubmenu)}
          cursor="pointer"
        />
      ) : null}
    </Flex>
  )
}
