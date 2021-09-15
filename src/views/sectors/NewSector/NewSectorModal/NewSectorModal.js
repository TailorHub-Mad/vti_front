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
import { CloseIcon } from "../../../../components/icons/CloseIcon"
import useSectorApi from "../../../../hooks/api/useSectorApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { NewSectorForm } from "../NewSectorForm/NewSectorForm"

export const NewSectorModal = ({ isOpen, onClose, sectorToEdit, ...props }) => {
  const { showToast } = useContext(ToastContext)
  const { createSector, updateSector } = useSectorApi()
  const { mutate, cache } = useSWRConfig()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEdit = Boolean(sectorToEdit)

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
        !value.title
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const updatedSectorsList = isEdit
      ? await handleEditSector()
      : await handleCreateSector()

    updatedSectorsList
      ? await mutate(SWR_CACHE_KEYS.sectors, updatedSectorsList, false)
      : await mutate(SWR_CACHE_KEYS.sectors)

    showToast(isEdit ? "Editado correctamente" : "¡Has añadido nuevo/s ensayo/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateSector = async () => {
    const sectorsToCreate = [...values]
    const sectorsQueue = sectorsToCreate.map((sector) => createSector(sector))
    const response = await Promise.all(sectorsQueue)

    const [sectorsSuccessfull, sectorsError] = response.reduce(
      ([succ, error], e, index) => {
        e?.error
          ? error.push(sectorsToCreate[index])
          : succ.push(sectorsToCreate[index])
        return [succ, error]
      },
      [[], []]
    )

    // // TODO -> manage errors
    if (sectorsError.length > 0) {
      console.log("ERROR")
    }

    if (cache.has(SWR_CACHE_KEYS.sectors)) {
      const cacheSectors = cache.get(SWR_CACHE_KEYS.sectors)
      const updatedSectors = []
      const formatSectorsSuccessfull = sectorsSuccessfull.map((sector) => {
        return {
          ...sector,
          projects: [],
          notes: [],
        }
      })
      updatedSectors.push({
        testSectors: [...formatSectorsSuccessfull, ...cacheSectors[0].testSectors],
      })
      return updatedSectors
    }

    return null
  }

  const handleEditSector = async () => {
    const { id } = sectorToEdit
    const [formatedSector] = [...values]
    const response = await updateSector(id, { title: formatedSector.title })

    // // TODO -> manage errors
    if (response?.error) {
      console.log("ERROR")
    }

    // TODO -> optimize cache request (update cache with updated sector)
    return null
  }

  useEffect(() => {
    if (!sectorToEdit) return
    const { id, title } = sectorToEdit || {}
    setValues([{ title, id }])
  }, [sectorToEdit])

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
            {isEdit ? "Editar sector" : "Añadir nuevo sector"}
          </Text>
          <CloseIcon width="24px" height="24px" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        {values.map((sector, idx) => (
          <Box key={`sector-${idx}`}>
            {idx !== 0 ? (
              <Text margin="32px 0" variant="d_l_medium">
                Añadir nuevo sector
              </Text>
            ) : null}
            <NewSectorForm
              value={sector}
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
            Añadir nuevo sector
          </Button>
        )}
      </ModalContent>
    </Modal>
  )
}
