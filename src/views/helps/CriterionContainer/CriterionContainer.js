import React, { useContext, useState } from "react"
import { Flex, Box, Grid, Text } from "@chakra-ui/react"
import { CriterionGroupCard } from "../../../components/cards/CriterionGroupCard/CriterionGroupCard"
import { ChevronDuoUpIcon } from "../../../components/icons/ChevronDuoUpIcon"
import { ChevronDuoDownIcon } from "../../../components/icons/ChevronDuoDownIcon"
import { NewCriterionGroupCard } from "../NewCriterionGroupCard/NewCriterionGroupCard"
import { DeleteIcon } from "../../../components/icons/DeleteIcon"
import useHelpApi from "../../../hooks/api/useHelpApi"
import { Popup } from "../../../components/overlay/Popup/Popup"
import { ToastContext } from "../../../provider/ToastProvider"
import { NewCriterionModal } from "../NewCriterion/NewCriterionModal/NewCriterionModal"
import { CriterionGroupSupportCard } from "../../../components/cards/CriterionGroupSupportCard/CriterionGroupSupportCard"

export const CriterionContainer = ({
  criterion,
  onDelete,
  onMoveUp,
  onMoveDown,
  criteria,
  updateCriteria,
  isProjectCriteria,
  unusedTags,
  usedTags,
  onTagSelect,
  isSupport,
  selectedTags,
  ...props
}) => {
  const {
    createProjectGroup,
    updateProjectCriterion,
    createNoteGroup,
    updateNoteCriterion
  } = useHelpApi()

  const { showToast } = useContext(ToastContext)
  const [infoToDeleteTags, setInfoToDeleteTags] = useState(null)
  const [isCriterionModalOpen, setIsCriterionModalOpen] = useState(false)
  const [groupToEdit, setGroupToEdit] = useState(null)
  const [editOnlyTags, setEditOnlyTags] = useState(null)
  const handleCreateGroup = async (newGroupName) => {
    const updatedCriterion = {
      ...criterion,
      group: [
        ...criterion.group,
        { name: newGroupName, relatedTags: [], createdAt: new Date() }
      ]
    }
    isProjectCriteria
      ? await createProjectGroup(criterion._id, {
          name: newGroupName
        })
      : await createNoteGroup(criterion._id, {
          name: newGroupName
        })
    const _data = criteria.filter((crit) => crit._id !== criterion._id)
    updateCriteria([..._data, updatedCriterion])
  }

  const handleDeleteGroup = async (groupName) => {
    const _group = criterion.group.filter((gr) => gr.name !== groupName)

    //hay que mapear los relatedTags para que sólo se envíe el id
    const updatedCriterion = {
      ...criterion,
      group: _group.map((gro) => ({
        ...gro,
        relatedTags: gro.relatedTags.map((rt) => rt._id)
      }))
    }
    isProjectCriteria
      ? await updateProjectCriterion(criterion._id, updatedCriterion)
      : await updateNoteCriterion(criterion._id, updatedCriterion)

    //update state con los relatedTags populados
    const _data = criteria.filter((crit) => crit._id !== criterion._id)
    updateCriteria([..._data, { ...criterion, group: _group }])
  }

  const handleDeleteTags = async () => {
    if (!infoToDeleteTags) return null
    const { groupName, tagsToDelete } = infoToDeleteTags

    const _groups = criterion.group.filter((gr) => gr.name !== groupName)
    const [groupToUpdate] = criterion.group.filter((gr) => gr.name === groupName)

    const updatedGroup = {
      ...groupToUpdate,
      relatedTags: groupToUpdate.relatedTags.filter(
        (rt) => !tagsToDelete.includes(rt._id)
      )
    }

    const updatedGroups = [..._groups, updatedGroup]

    const updatedCriterion = {
      ...criterion,
      group: updatedGroups.map((gro) => ({
        ...gro,
        relatedTags: gro.relatedTags.map((rt) => rt._id)
      }))
    }
    await updateNoteCriterion(criterion._id, updatedCriterion)

    //update state con los relatedTags populados
    //TODO No se actualiza el state pero si borra :/
    const _data = criteria.filter((crit) => crit._id !== criterion._id)
    updateCriteria([..._data, { ...criterion, group: updatedGroups }])
    setInfoToDeleteTags(null)
    showToast("Tags eliminadas correctamente")
  }

  const getTagName = () => {
    if (!infoToDeleteTags) return null
    const { groupName, tagsToDelete } = infoToDeleteTags
    const [_group] = criterion.group.filter((gr) => gr.name === groupName)
    const [tag] = _group.relatedTags.filter((t) => t._id === tagsToDelete[0])
    return tag?.name
  }

  const handleOnCloseModal = () => {
    setIsCriterionModalOpen(false)
  }
  // console.log("usadas", usedTags)
  return (
    <>
      {!isSupport ? (
        <>
          <Popup
            variant="twoButtons"
            confirmText="Eliminar"
            cancelText="Cancelar"
            color="error"
            isOpen={infoToDeleteTags}
            onConfirm={handleDeleteTags}
            onClose={() => setInfoToDeleteTags(false)}
          >
            {`¿Desea eliminar ${
              infoToDeleteTags?.tagsToDelete?.length > 1
                ? "los tags seleccionados"
                : getTagName()
            }?`}
          </Popup>

          <NewCriterionModal
            criterionToEdit={criterion}
            groupToEdit={groupToEdit}
            isOpen={isCriterionModalOpen}
            onClose={handleOnCloseModal}
            editTitle="Editar criterio"
            addSuccessMsg="Criterio editado satisfactoriamente"
            onSuccessEdit={updateCriteria}
            isProjectView={isProjectCriteria}
            editOnlyTags={editOnlyTags}
            unusedTags={unusedTags}
            usedTags={usedTags}
            criteria={criteria}
          />
        </>
      ) : null}

      <Box>
        {!isSupport ? (
          <Flex width="100%" alignItems="center" {...props}>
            <DeleteIcon
              onClick={onDelete}
              width="16px"
              color="grey"
              mb="2px"
              mr="8px"
              cursor="pointer"
            />
            <Text variant="d_m_medium" mr="2px">
              {criterion.title}
            </Text>
            <ChevronDuoUpIcon mb="4px" onClick={onMoveUp} cursor="pointer" />
            <ChevronDuoDownIcon mb="4px" onClick={onMoveDown} cursor="pointer" />
          </Flex>
        ) : null}

        <Grid
          templateColumns={isSupport ? "auto auto" : "repeat(auto-fill, 266px)"}
          gap="16px"
          width="100%"
          mt="8px"
          mb="24px"
        >
          {!isSupport ? (
            <NewCriterionGroupCard createCriterionGroup={handleCreateGroup} />
          ) : null}

          {!isSupport
            ? criterion.group.map((group) => (
                <CriterionGroupCard
                  group={group}
                  onEdit={() => {
                    setGroupToEdit(group)
                    setIsCriterionModalOpen(true)
                  }}
                  onAddTags={() => {
                    setEditOnlyTags(true)
                    setGroupToEdit(group)
                    setIsCriterionModalOpen(true)
                  }}
                  onDeleteGroup={() => handleDeleteGroup(group.name)}
                  onDeleteTags={(tagsToDelete) =>
                    setInfoToDeleteTags({
                      groupName: group.name,
                      tagsToDelete: tagsToDelete
                    })
                  }
                  key={group.title}
                  id={group.title}
                />
              ))
            : criterion.group
                .filter((gr) => gr?.relatedTags?.length >= 1)
                .map((group) => (
                  <CriterionGroupSupportCard
                    key={group.title}
                    id={group.title}
                    group={group}
                    onTagsSelect={(_tgs) => onTagSelect(_tgs)}
                    selectedTags={selectedTags}
                  />
                ))}
        </Grid>
      </Box>
    </>
  )
}
