import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useDepartmentApi from "../../../../hooks/api/useDepartmentApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { NewDepartmentForm } from "../NewDepartmentForm/NewDepartmentForm"

export const NewDepartmentModal = ({
  isOpen,
  onClose,
  departmentToUpdate,
  ...props
}) => {
  const { showToast } = useContext(ToastContext)
  const { createDepartment, updateDepartment } = useDepartmentApi()
  const { mutate, cache } = useSWRConfig()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(departmentToUpdate)

  const handleChange = (val, idx) => {
    const _values = [...values]
    _values[idx] = val
    setValues(_values)
  }

  const handleDelete = (index) => {
    const _values = [...values]
    _values.splice(index, 1)
    setValues(_values)
  }

  const checkInputsAreEmpty = () => {
    return values.some(
      (value) =>
        // TODO -> autogenerate ID
        // !value.id ||
        !value.name
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const updatedDepartmentsList = isUpdate
      ? await handleUpdateDepartment()
      : await handleCreateDepartment()

    updatedDepartmentsList
      ? await mutate(SWR_CACHE_KEYS.departments, updatedDepartmentsList, false)
      : await mutate(SWR_CACHE_KEYS.departments)

    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s sistema/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateDepartment = async () => {
    const departmentsToCreate = [...values]
    const departmentsQueue = departmentsToCreate.map((department) =>
      createDepartment(department)
    )
    const response = await Promise.all(departmentsQueue)

    const [departmentsSuccessfull, departmentsError] = response.reduce(
      ([succ, error], e, index) => {
        e?.error
          ? error.push(departmentsToCreate[index])
          : succ.push(departmentsToCreate[index])
        return [succ, error]
      },
      [[], []]
    )

    // // TODO -> manage errors
    if (departmentsError.length > 0) {
      console.log("ERROR")
    }

    if (cache.has(SWR_CACHE_KEYS.departments)) {
      const cacheDepartments = cache.get(SWR_CACHE_KEYS.departments)
      const updatedDepartments = []
      const formatDepartmentsSuccessfull = departmentsSuccessfull.map(
        (department) => {
          return {
            ...department,
            projects: [],
            notes: [],
          }
        }
      )
      updatedDepartments.push({
        testDepartments: [
          ...formatDepartmentsSuccessfull,
          ...cacheDepartments[0]?.testDepartments,
        ],
      })
      return updatedDepartments
    }

    return null
  }

  const handleUpdateDepartment = async () => {
    const { id } = departmentToUpdate
    const [formatedDepartment] = [...values]

    const response = await updateDepartment(id, { name: formatedDepartment.name })

    // // TODO -> manage errors
    if (response?.error) {
      console.log("ERROR")
    }

    // TODO -> optimize cache request (update cache with updated department)
    return null
  }

  useEffect(() => {
    if (!departmentToUpdate) return
    const { id, name } = departmentToUpdate || {}
    setValues([{ name, id }])
  }, [departmentToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar departamento" : "Añadir nuevo departamento"}
          onClose={onClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          addTitle="Añadir nuevo departamento"
        >
          <NewDepartmentForm />
        </MultipleFormContent>
        <Button
          w="194px"
          margin="0 auto"
          mt="24px"
          disabled={checkInputsAreEmpty()}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          pointerEvents={isSubmitting ? "none" : "all"}
        >
          Guardar
        </Button>
        {!isUpdate ? (
          <Button
            variant="text_only"
            onClick={() => setValues([...values, {}])}
            disabled={checkInputsAreEmpty()}
          >
            Añadir nuevo departamento
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
