/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Container,
  useOutsideClick,
} from "@chakra-ui/react"
import React, { useContext, useRef, useState } from "react"
import { Filter } from "../../../components/filters/Filter/Filter"
import { Group } from "../../../components/grouping/Group/Group"
import { AddTestSystemIcon } from "../../../components/icons/AddTestSystemIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"
import { OptionsMenuFiles } from "../../../components/navigation/OptionsMenuFiles/OptionsMenuFiles"
import { ApiUserContext } from "../../../provider/ApiAuthProvider"

export const TestSystemsToolbar = ({ onAddTestSystem, onSearch }) => {
  const { role } = useContext(ApiUserContext)

  const [openMenu, setOpenMenu] = useState()

  const handleOnClick = () => setOpenMenu(!openMenu)

  const handleOnImport = () => {
    console.log("presiona el import")
  }

  const ref = useRef(null)

  useOutsideClick({
    ref: ref,
    handler: () => setOpenMenu(false),
  })

  return (
    <>
      <Filter />
      <Group />
      <InputGroup width="196px" marginRight="16px">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray" />}
        />
        <Input
          placeholder="Busque por ID, código"
          paddingLeft="40px"
          variant="white"
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>
      {role === "admin" && (
        <>
          <Container position="relative" width="auto" ref={ref}>
            <Button
              variant="icon_only_secondary"
              marginRight="16px"
              onClick={handleOnClick}
            >
              <UploadCloudIcon />
            </Button>
            {openMenu && <OptionsMenuFiles onImport={handleOnImport} />}
          </Container>

          <Button onClick={onAddTestSystem}>
            <AddTestSystemIcon marginRight="8px" />
            Añadir sistema
          </Button>
        </>
      )}
    </>
  )
}
