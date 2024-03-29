import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useSystemApi from "../../../../hooks/api/useSystemApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { checkIsYear } from "../../../../utils/functions/forms"
import { NewTestSystemForm } from "../NewTestSystemForm/NewTestSystemForm"

const initialValues = [{}]

export const NewTestSystemModal = ({ isOpen, onClose, systemToUpdate }) => {
  const { showToast } = useContext(ToastContext)
  const { createSystem, updateSystem } = useSystemApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(systemToUpdate)

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
        !checkIsYear(value.year) ||
        !value.vtiCode ||
        !value.clientAlias ||
        !value.alias ||
        !value.year
    )
  }

  const formatCreateSystems = (systems) => {
    return systems.map((value) => {
      const { clientAlias, year, vtiCode, alias } = value
      return {
        vtiCode: vtiCode.value,
        alias,
        date: {
          year
        },
        client: clientAlias.value
      }
    })
  }

  const formatUpdateSystems = (systems) => {
    return systems.map((value) => {
      const { year, alias } = value
      return {
        alias,
        date: {
          year
        }
      }
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateSystem() : await handleCreateSystem()
    setValues(initialValues)
    await mutate(SWR_CACHE_KEYS.systems)
    showToast({
      message: isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s sistema/s!"
    })
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateSystem = async () => {
    try {
      const systemsToCreate = formatCreateSystems(values)
      for (let index = 0; index < systemsToCreate.length; index++) {
        await createSystem(systemsToCreate[index])
      }
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateSystem = async () => {
    try {
      const { _id } = systemToUpdate
      const [data] = formatUpdateSystems(values)
      await updateSystem(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues(initialValues)
    onClose()
  }

  useEffect(() => {
    if (!systemToUpdate) return
    const { vtiCode, clientAlias, alias } = systemToUpdate

    const year = systemToUpdate?.date?.year || ""
    setValues([{ vtiCode, clientAlias, alias, year }])
  }, [systemToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar sistema" : "Añadir nuevo sistema"}
          onClose={handleOnClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          objectToUpdate={systemToUpdate}
          addTitle="Añadir nuevo sistema"
        >
          <NewTestSystemForm />
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

        {isUpdate || (
          <Button
            variant="text_only"
            onClick={() => setValues([...values, {}])}
            disabled={checkInputsAreEmpty()}
          >
            Añadir nuevo sistema
          </Button>
        )}
      </ModalContent>
    </Modal>
  )
}
