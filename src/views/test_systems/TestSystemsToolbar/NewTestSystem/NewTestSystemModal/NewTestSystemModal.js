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
import { useSWRConfig } from "swr"
import { CloseIcon } from "../../../../../components/icons/CloseIcon"
import useSystemApi from "../../../../../hooks/api/useSystemsApi"
import { ApiToastContext } from "../../../../../provider/ApiToastProvider"
import { SWR_CACHE_KEYS } from "../../../../../utils/constants/swr"
import { NewTestSystemForm } from "../NewTestSystemForm/NewTestSystemForm"

export const NewTestSystemModal = ({ isOpen, onClose, systemToEdit, ...props }) => {
  const { showToast } = useContext(ApiToastContext)
  const { createSystem, editSystem } = useSystemApi()
  const { mutate, cache } = useSWRConfig()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = Boolean(systemToEdit)

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

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const updatedSystemsList = isEdit
      ? await handleEditSystem()
      : await handleCreateSystem()

    updatedSystemsList
      ? await mutate(SWR_CACHE_KEYS.systems, updatedSystemsList, false)
      : await mutate(SWR_CACHE_KEYS.systems)

    showToast(isEdit ? "Editado correctamente" : "¡Has añadido nuevo/s ensayo/s!")
    setIsSubmitting(false)
    onClose()
  }

  const formatSystems = (systems) => {
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

  const handleCreateSystem = async () => {
    const systemsToCreate = formatSystems(values)
    const systemsQueue = systemsToCreate.map((system) => createSystem(system))
    const response = await Promise.all(systemsQueue)

    const [systemsSuccessfull, systemsError] = response.reduce(
      ([succ, error], e, index) => {
        e?.error
          ? error.push(systemsToCreate[index])
          : succ.push(systemsToCreate[index])
        return [succ, error]
      },
      [[], []]
    )

    // // TODO -> manage errors
    if (systemsError.length > 0) {
      console.log("ERROR")
    }

    if (cache.has(SWR_CACHE_KEYS.systems)) {
      const cacheSystems = cache.get(SWR_CACHE_KEYS.systems)
      const updatedSystems = []
      const formatSystemsSuccessfull = systemsSuccessfull.map((system) => {
        return {
          ...system,
          projects: [],
          notes: [],
        }
      })
      updatedSystems.push({
        testSystems: [...formatSystemsSuccessfull, ...cacheSystems[0].testSystems],
      })
      return updatedSystems
    }

    return null
  }

  const handleEditSystem = async () => {
    const { _id } = systemToEdit
    const [formatedSystem] = formatSystems(values)

    // TODO -> provisional
    delete formatedSystem["client"]

    const response = await editSystem(_id, formatedSystem)

    // // TODO -> manage errors
    if (response?.error) {
      console.log("ERROR")
    }

    // TODO -> optimize cache request (update cache with updated system)
    return null
  }

  useEffect(() => {
    if (!systemToEdit) return
    const {
      _id,
      vtiCode,
      clientAlias,
      alias,
      date: { year },
    } = systemToEdit || {}
    setValues([{ vtiCode, clientAlias, alias, year, id: _id }])
  }, [systemToEdit])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

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
            {isEdit ? "Editar sistema" : "Añadir nuevo sistema"}
          </Text>
          <CloseIcon width="24px" height="24px" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        {values.map((system, index) => (
          <Box key={`system-${index}`}>
            {index !== 0 && (
              <Text margin="32px 0" variant="d_l_medium">
                Añadir nuevo sistema
              </Text>
            )}

            <NewTestSystemForm
              value={system}
              onChange={(value) => handleChange(value, index)}
            />

            {index !== 0 && (
              <Button
                variant="text_only"
                color="error"
                onClick={() => handleDelete(index)}
              >
                Eliminar
              </Button>
            )}
          </Box>
        ))}
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

        {isEdit || (
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
