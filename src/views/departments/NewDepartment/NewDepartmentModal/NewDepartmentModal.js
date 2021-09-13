import {
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  ModalHeader,
  Button,
  Box,
} from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { CloseIcon } from "../../../../components/icons/CloseIcon"
import useDepartmentApi from "../../../../hooks/api/useDepartmentApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { NewDepartmentForm } from "../NewDepartmentForm/NewDepartmentForm"

export const NewDepartmentModal = ({
  isOpen,
  onClose,
  departmentToEdit,
  ...props
}) => {
  const [values, setValues] = useState([{}])
  const isEdit = departmentToEdit
  const { showToast } = useContext(ToastContext)
  const { createDepartment } = useDepartmentApi()
  const handleChange = (val, idx) => {
    const _values = [...values]
    _values[idx] = val
    setValues(_values)
  }
  const handleDelete = (idx) => {
    const _values = [...values]
    _values.splice(idx, 1)
    setValues(_values)
  }

  const checkInputs = () => {
    return values.some((val) => !val.name || !val.id || !val.alias)
  }

  const handleSubmit = async () => {
    const departmentsQueue = values.map(async (val) => {
      return await createDepartment(val)
    })

    const resultsArr = await Promise.all(departmentsQueue)
    //Meter toast de éxito
    showToast("Departamento añadido correctamente!")
    onClose()
    if (resultsArr.some((result) => result.error)) {
      console.log("ERROR")
      return
    }
  }

  useEffect(() => {
    const { name, alias, id } = departmentToEdit || {}
    setValues([{ name, alias, id: id }])
  }, [departmentToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <ModalHeader
          mb="32px"
          display="flex"
          p="0"
          justifyContent="space-between"
          w="100%"
        >
          <Text variant="d_l_medium">
            {isEdit ? "Editar departamento" : "Añadir nuevo departamento"}
          </Text>
          <CloseIcon width="24px" height="24px" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        {values.map((department, idx) => (
          <Box key={`department-${idx}`}>
            {idx !== 0 ? (
              <Text margin="32px 0" variant="d_l_medium">
                Añadir nuevo departamento
              </Text>
            ) : null}
            <NewDepartmentForm
              value={department}
              onChange={(val) => handleChange(val, idx)}
            />
            {idx !== 0 ? (
              <Button
                variant="text_only"
                color="error"
                onClick={() => handleDelete(idx)}
              >
                Eliminar
              </Button>
            ) : null}
          </Box>
        ))}
        <Button
          w="194px"
          margin="0 auto"
          mt="24px"
          disabled={checkInputs()}
          onClick={handleSubmit}
        >
          Guardar
        </Button>
        {!isEdit ? (
          <Button
            variant="text_only"
            onClick={() => setValues([...values, {}])}
            disabled={checkInputs()}
          >
            Añadir nuevo departamento
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
