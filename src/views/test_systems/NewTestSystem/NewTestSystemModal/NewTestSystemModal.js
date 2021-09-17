import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useSystemApi from "../../../../hooks/api/useSystemApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { NewTestSystemForm } from "../NewTestSystemForm/NewTestSystemForm"

export const NewTestSystemModal = ({ isOpen, onClose, systemToUpdate }) => {
  const { showToast } = useContext(ToastContext)
  const { createSystem, updateSystem } = useSystemApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState([{}])
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
        // TODO -> autogenerate ID
        // !value.id ||
        !value.vtiCode || !value.clientAlias || !value.alias || !value.year
    )
  }

  const formatCreateSystems = (systems) => {
    return systems.map((value) => {
      const { clientAlias: client, year, vtiCode, alias } = value
      return {
        vtiCode,
        alias,
        date: {
          year,
        },
        client,
      }
    })
  }

  const formatUpdateSystems = (systems) => {
    return systems.map((value) => {
      const { year, alias } = value
      return {
        alias,
        date: {
          year,
        },
      }
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateSystem() : await handleCreateSystem()
    await mutate(SWR_CACHE_KEYS.systems)
    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s sistema/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateSystem = async () => {
    try {
      const systemsToCreate = formatCreateSystems(values)
      const systemsQueue = systemsToCreate.map((system) => createSystem(system))
      await Promise.all(systemsQueue)
    } catch (error) {
      // TODO -> manage errors
      console.log("ERROR")
    }
  }

  const handleUpdateSystem = async () => {
    try {
      const { _id } = systemToUpdate
      const [data] = formatUpdateSystems(values)
      await updateSystem(_id, data)
    } catch (error) {
      // TODO -> manage errors
      console.log("ERROR")
    }
  }

  useEffect(() => {
    if (!systemToUpdate) return
    const {
      vtiCode,
      clientAlias,
      alias,
      date: { year },
    } = systemToUpdate
    setValues([{ vtiCode, clientAlias, alias, year }])
  }, [systemToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar sistema" : "Añadir nuevo sistema"}
          onClose={onClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
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
