import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { AuxFilter } from "./AuxFilter/AuxFilter"
import { MainFilter } from "./MainFilter/MainFilter"
import { SupportFilter } from "./SupportFilter/SupportFilter"
import { SaveFilterModal } from "./SaveFilterModal/SaveFilterModal"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import useHelpApi from "../../../hooks/api/useHelpApi"
import useTagApi from "../../../hooks/api/useTagApi"
import { SupportModal } from "../../helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"

export const ProjectsFilterModal = ({ isOpen, onClose, onFilter, ...props }) => {
  const [showMainContent] = useState(true)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [showAuxContent, setShowAuxContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)

  const initialValues = {
    client: undefined,
    test_system: [{ label: "", value: "" }],
    year: undefined,
    vti_code: [{ label: "", value: "" }],
    focus_point: [{ label: "", value: "" }],
    sector: [{ label: "", value: "" }],
    tag_project: [{ label: "", value: "" }]
  }

  const { getProjectHelps } = useHelpApi()
  const { getProjectTags } = useTagApi()

  const [filterValues, setFilterValues] = useState(initialValues)
  const [usedProjectTags, setUsedProjectTags] = useState([])
  const [projectCriteria, setProjectCriteria] = useState([])

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
  const handleTagSelect = (_tags) => {
    const refTags = filterValues.tag_project
    const refUsed = usedProjectTags
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

    setFilterValues({
      ...filterValues,
      tag_project: nextTags
    })
  }

  useEffect(() => {
    const fetchCriteria = async () => {
      const _data = await getProjectHelps()
      setProjectCriteria(_data)
    }

    const fetchTags = async () => {
      const _tags = await getProjectTags()
      const _used = _tags.filter((tag) => !tag.isUsed)
      setUsedProjectTags(_used)
    }

    fetchCriteria()
    fetchTags()
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade in={showSecondaryContent || !showSecondaryContent}>
          <MainFilter
            simpleFilterValues={filterValues}
            onClose={handleOnClose}
            moveToLeft={showSecondaryContent}
            onSecondaryOpen={() => setShowSecondaryContent(true)}
            onSimpleFilterChange={(val) => setFilterValues(val)}
            openSaveModal={() => setShowSaveFilter(true)}
            onFilter={handleOnFilter}
            onReset={handleOnReset}
          />
        </ScaleFade>
        {showSaveFilter ? (
          <SaveFilterModal onClose={() => setShowSaveFilter(false)} />
        ) : null}
        {showSecondaryContent ? (
          <SupportModal
            onClose={() => setShowSecondaryContent(false)}
            usedTags={usedProjectTags}
            criteria={projectCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags, true)}
            selectedTags={filterValues?.tag_project?.map((t) => t.label) || []}
          />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
