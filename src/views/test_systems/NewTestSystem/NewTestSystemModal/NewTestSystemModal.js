import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useSystemApi from "../../../../hooks/api/useSystemApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { NewNoteForm } from "../../../notes/NewNote/NewNoteForm/NewNoteForm"

export const NewTestSystemModal = ({
  isOpen,
  onClose,
  systemToUpdate,
  ...props
}) => {
  const { showToast } = useContext(ToastContext)
  const { createSystem, updateSystem } = useSystemApi()
  const { mutate, cache } = useSWRConfig()

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

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const updatedSystemsList = isUpdate
      ? await handleUpdateSystem()
      : await handleCreateSystem()

    updatedSystemsList
      ? await mutate(SWR_CACHE_KEYS.systems, updatedSystemsList, false)
      : await mutate(SWR_CACHE_KEYS.systems)

    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s sistema/s!")
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

    // TODO -> manage errors
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

  const handleUpdateSystem = async () => {
    const { id } = systemToUpdate
    const [formatedSystem] = formatSystems(values)

    // TODO -> provisional
    delete formatedSystem["client"]

    const response = await updateSystem(id, formatedSystem)

    // TODO -> manage errors
    if (response?.error) {
      console.log("ERROR")
    }

    // TODO -> optimize cache request (update cache with updated system)
    return null
  }

  useEffect(() => {
    if (!systemToUpdate) return
    const {
      id,
      vtiCode,
      clientAlias,
      alias,
      date: { year },
    } = systemToUpdate
    setValues([{ vtiCode, clientAlias, alias, year, id }])
  }, [systemToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
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
          <NewNoteForm />
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
