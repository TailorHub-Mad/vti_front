import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { AuxFilter } from "./AuxFilter/AuxFilter"
import { MainFilter } from "./MainFilter/MainFilter"
import { SupportFilter } from "./SupportFilter/SupportFilter"
import { SaveFilterModal } from "./SaveFilterModal/SaveFilterModal"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { SupportModal } from "../../helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"
import useHelpApi from "../../../hooks/api/useHelpApi"
import useTagApi from "../../../hooks/api/useTagApi"

export const NotesFilterModal = ({ isOpen, onClose, onFilter, ...props }) => {
  const [showMainContent] = useState(true)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [showAuxContent, setShowAuxContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)

  const initialValues = {
    project: { label: "", value: "" },
    test_system: { label: "", value: "" },
    client: { label: "", value: "" },
    dates: [{ label: "", value: "" }],
    users: [{ label: "", value: "" }],
    vti_code: [{ label: "", value: "" }],
    project_tags: [{ label: "", value: "" }],
    note_tags: [{ label: "", value: "" }],
    only_suscribed: false,
    only_favs: false,
    only_unread: false,
    with_links: false,
    formalized: false,
    closed: false,
    with_responses: false
  }

  const [filterValues, setFilterValues] = useState(initialValues)
  const [usedProjectTags, setUsedProjectTags] = useState([])
  const [usedNoteTags, setUsedNoteTags] = useState([])
  const [projectCriteria, setProjectCriteria] = useState([])
  const [noteCriteria, setNoteCriteria] = useState([])

  const { getProjectHelps, getNoteHelps } = useHelpApi()

  const { getProjectTags, getNoteTags } = useTagApi()

  const handleOnReset = () => {
    setFilterValues(initialValues)
    onFilter(null)
  }

  const handleOnFilter = () => {
    setFilterValues(initialValues)
    onFilter(filterValues)
  }

  const handleOnClose = () => {
    setFilterValues(initialValues)
    onClose()
  }

  //TODO Esta función se repite en todos los apoyos, se podría refactorizar para meterla en utils
  const handleTagSelect = (_tags, isProject) => {
    const refTags = isProject ? filterValues.project_tags : filterValues.note_tags
    const refUsed = isProject ? usedProjectTags : usedNoteTags
    let nextTags = refTags ? [...refTags] : []

    _tags.forEach((_tag) => {
      if (nextTags.map((t) => t.label).includes(_tag)) {
        nextTags = nextTags.filter((rt) => rt.label !== _tag)
        return
      }
      const [tagInfo] = refUsed.filter((t) => _tag === t.name)
      const selectedTag = { label: tagInfo.name, value: tagInfo._id }
      nextTags.push(selectedTag)
    })
    isProject
      ? setFilterValues({
          ...filterValues,
          project_tags: nextTags
        })
      : setFilterValues({
          ...filterValues,
          note_tags: nextTags
        })
  }

  useEffect(() => {
    const fetchCriteria = async (isProject) => {
      const _data = isProject ? await getProjectHelps() : await getNoteHelps()
      isProject ? setProjectCriteria(_data) : setNoteCriteria(_data)
    }

    const fetchTags = async (isProject) => {
      const _tags = isProject ? await getProjectTags() : await getNoteTags()
      const _used = _tags.filter((tag) => !tag.isUsed)
      isProject ? setUsedProjectTags(_used) : setUsedNoteTags(_used)
    }

    fetchCriteria(true)
    fetchCriteria()
    fetchTags(true)
    fetchTags()
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade
          in={
            !showSaveFilter &&
            showMainContent &&
            (!showSecondaryContent || showSecondaryContent !== "project")
          }
        >
          <MainFilter
            simpleFilterValues={filterValues}
            onClose={handleOnClose}
            moveToLeft={["project_tags", "note_tags"].includes(showSecondaryContent)}
            onSecondaryOpen={(type) => setShowSecondaryContent(type)}
            onSimpleFilterChange={(val) => setFilterValues(val)}
            openSaveModal={() => setShowSaveFilter(true)}
            onFilter={handleOnFilter}
            onReset={handleOnReset}
          />
        </ScaleFade>
        {showSaveFilter ? (
          <SaveFilterModal onClose={() => setShowSaveFilter(false)} />
        ) : null}
        {!showSaveFilter && showSecondaryContent === "project" ? (
          <SupportFilter
            onClose={() => setShowSecondaryContent(false)}
            onSecondaryOpen={() => setShowAuxContent(true)}
            isAuxOpen={showAuxContent}
          />
        ) : null}
        {!showSaveFilter && showSecondaryContent === "project_tags" ? (
          <SupportModal
            onClose={() => setShowSecondaryContent(false)}
            usedTags={usedProjectTags}
            criteria={projectCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags, true)}
            selectedTags={filterValues.project_tags.map((t) => t.label)}
          />
        ) : null}
        {!showSaveFilter && showSecondaryContent === "note_tags" ? (
          <SupportModal
            onClose={() => setShowSecondaryContent(false)}
            usedTags={usedNoteTags}
            criteria={noteCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags)}
            selectedTags={filterValues.note_tags.map((t) => t.label)}
          />
        ) : null}

        {!showSaveFilter && showAuxContent && showSecondaryContent === "project" ? (
          <SupportModal
            onClose={() => setShowAuxContent(false)}
            usedTags={usedProjectTags}
            criteria={projectCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags, true)}
            selectedTags={filterValues.project_tags.map((t) => t.label)}
          />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
