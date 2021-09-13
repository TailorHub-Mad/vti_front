import { Box, Button, Input } from "@chakra-ui/react"
import React from "react"
import { MOCK_SELECT_OPTIONS } from "../../../../mock/mock"
import { FormController } from "../../../forms/FormItemWrapper/FormController"
import { InputSelect } from "../../../forms/InputSelect/InputSelect"
import { CustomModalHeader } from "../../../overlay/Modal/CustomModalHeader/CustomModalHeader"

export const SupportFilter = ({ onClose, onSecondaryOpen, isAuxOpen, ...props }) => {
  return (
    <Box
      width="460px"
      height="fit-content"
      position="absolute"
      top="50px"
      left={isAuxOpen ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
      transition="left 0.18s ease-in-out"
      bgColor="white"
      zIndex="1400"
      padding="32px"
      {...props}
    >
      <CustomModalHeader title="Apoyo búsqueda de proyecto" onClose={onClose} />
      <Box paddingTop="32px">
        <InputSelect
          options={MOCK_SELECT_OPTIONS}
          label="Sistema de ensayo"
          placeholder="AliasSE"
          marginBottom="32px"
        />
        <InputSelect
          options={MOCK_SELECT_OPTIONS}
          label="Cliente"
          placeholder="AliasCL"
          marginBottom="32px"
        />
        <InputSelect
          options={MOCK_SELECT_OPTIONS}
          label="Tag de proyecto"
          placeholder="Seleccione"
          marginBottom="32px"
          helper="Abrir ventana de apoyo"
          onHelperClick={onSecondaryOpen}
        />
        <FormController label="Fecha" marginBottom="32px">
          <Input placeholder="Desde el 00/00/0000 hasta el 00/00/0000" />
        </FormController>
        <Button margin="0 auto" display="block">
          Aplicar proyecto
        </Button>
      </Box>
    </Box>
  )
}
