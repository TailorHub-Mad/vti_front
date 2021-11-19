import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { MainFilter } from "./MainFilter/MainFilter"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import useHelpApi from "../../../hooks/api/useHelpApi"
import useTagApi from "../../../hooks/api/useTagApi"
import { SupportModal } from "../../helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"
import { SaveFilterModal } from "../../../components/filters/SaveFilterModal"
import { COMPLEX_OBJECT, parseComplexQuery } from "../../../utils/functions/filter"

export const ProjectsFilterModal = ({
  isOpen,
  onClose,
  onFilter,
  filterValues,
  setFilterValues,
  filterComplexValues,
  setFilterComplexValues,
  ...props
}) => {
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)
  const [tab, setTab] = useState(0)

  const initialValues = {
    client: [{ label: "", value: "" }],
    test_system: [{ label: "", value: "" }],
    year: undefined,
    vti_code: [{ label: "", value: "" }],
    focus_point: [{ label: "", value: "" }],
    sector: [{ label: "", value: "" }],
    tag_project: [{ label: "", value: "" }]
  }

  const { getProjectHelps } = useHelpApi()
  const { getProjectTags } = useTagApi()
  const [usedProjectTags, setUsedProjectTags] = useState([])
  const [projectCriteria, setProjectCriteria] = useState([])
  const [filterMetadata, setfilterMetadata] = useState(null)
  const [isUpdateFilter, setIsUpdateFilter] = useState(false)
  const [changeValueFilter, setChangeValueFilter] = useState(false)

  const handleOnReset = () => {
    setFilterValues(initialValues)
    onFilter(null)
  }

  const handleOnFilter = () => {
    if (filterComplexValues) {
      const query = parseComplexQuery(filterComplexValues, COMPLEX_OBJECT.PROJECTS)
      onFilter(query, "complex")
    } else {
      onFilter()
      // setFilterValues(initialValues)
    }
  }

  const handleOnClose = () => {
    // setFilterValues(initialValues)
    onClose()
  }

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

  const handleEditFilter = (filter) => {
    setfilterMetadata(filter)
    setIsUpdateFilter(true)
    setShowSaveFilter(true)
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

  useEffect(() => {
    setChangeValueFilter(true)
  }, [filterValues])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade in={showSecondaryContent || !showSecondaryContent}>
          {showSaveFilter ? (
            <SaveFilterModal
              onClose={() => setShowSaveFilter(false)}
              filter={!changeValueFilter ? filterMetadata.query : filterValues}
              filterMetadata={filterMetadata}
              isUpdateFilter={isUpdateFilter}
              type={tab === 0 ? "simple" : "complex"}
              object="projects"
            />
          ) : (
            <MainFilter
              simpleFilterValues={filterValues}
              onClose={handleOnClose}
              moveToLeft={showSecondaryContent}
              onSecondaryOpen={() => setShowSecondaryContent(true)}
              onSimpleFilterChange={(val) => setFilterValues(val)}
              openSaveModal={() => setShowSaveFilter(true)}
              onFilter={handleOnFilter}
              onReset={handleOnReset}
              setTab={setTab}
              onEdit={handleEditFilter}
              filterComplexValues={filterComplexValues}
              onFilterComplexChange={(val) => setFilterComplexValues(val)}
            />
          )}
        </ScaleFade>
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
