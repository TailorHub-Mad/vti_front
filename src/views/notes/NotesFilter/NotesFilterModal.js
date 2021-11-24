import { ScaleFade, Modal, ModalOverlay, useMediaQuery } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { MainFilter } from "./MainFilter/MainFilter"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { SupportModal } from "../../helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"
import useHelpApi from "../../../hooks/api/useHelpApi"
import useTagApi from "../../../hooks/api/useTagApi"
import { ProjectSupportModal } from "../../projects/ProjectFilter/ProjectSupportModal/ProjectSupportModal"
import { SaveFilterModal } from "../../../components/filters/SaveFilterModal"
import { COMPLEX_OBJECT, parseComplexQuery } from "../../../utils/functions/filter"

export const NotesFilterModal = ({
  isOpen,
  onClose,
  onFilter,
  noteFromProject,
  filterValues,
  setFilterValues,
  ...props
}) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  const [showMainContent] = useState(true)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)

  const initialValues = {
    project: { label: "", value: "" },
    test_system: { label: "", value: "" },
    client: { label: "", value: "" },
    dateFrom: "",
    dateTo: "",
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
    opened: false,
    with_responses: false
  }

  const [filterComplexValues, setFilterComplexValues] = useState(null)
  const [usedProjectTags, setUsedProjectTags] = useState([])
  const [usedNoteTags, setUsedNoteTags] = useState([])
  const [projectCriteria, setProjectCriteria] = useState([])
  const [noteCriteria, setNoteCriteria] = useState([])
  const [filterMetadata, setfilterMetadata] = useState(null)
  const [isUpdateFilter, setIsUpdateFilter] = useState(false)
  const [changeValueFilter, setChangeValueFilter] = useState(false)
  const [tab, setTab] = useState(0)
  const [errorComplexFilter, setErrorComplexFilter] = useState(false)

  const { getProjectHelps, getNoteHelps } = useHelpApi()

  const { getProjectTags, getNoteTags } = useTagApi()
  const handleProjectSelect = (_project) => {
    setFilterValues({ ...filterValues, project: _project })
  }

  const handleOnReset = () => {
    setFilterValues(initialValues)
    setFilterComplexValues(null)
    onFilter(null)
  }

  const handleOnFilter = () => {
    if (filterComplexValues) {
      const query = parseComplexQuery(filterComplexValues, COMPLEX_OBJECT.NOTES)
      if (!query) {
        setErrorComplexFilter(true)

        setTimeout(() => {
          setErrorComplexFilter(false)
        }, 3000)
      } else {
        onFilter(query, "complex")
      }
    } else {
      // setFilterValues(initialValues)
      onFilter(filterValues)
    }
  }

  const handleOnClose = () => {
    setFilterValues(initialValues)
    onClose()
  }

  const handleEditFilter = (filter) => {
    setfilterMetadata(filter)
    setIsUpdateFilter(true)
    setShowSaveFilter(true)
  }

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

  useEffect(() => {
    setChangeValueFilter(true)
  }, [filterValues])

  useEffect(() => {
    if (!noteFromProject) return

    setFilterValues({ ...filterValues, project: noteFromProject.project })
  }, [noteFromProject])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        {!showSaveFilter && showSecondaryContent && !isScreen ? null : (
          <ScaleFade
            in={
              !showSaveFilter &&
              showMainContent &&
              (!showSecondaryContent || showSecondaryContent !== "project")
            }
          >
            <MainFilter
              simpleFilterValues={filterValues}
              filterComplexValues={filterComplexValues}
              onClose={handleOnClose}
              moveToLeft={["project_tags", "note_tags"].includes(
                showSecondaryContent
              )}
              onSecondaryOpen={(type) => setShowSecondaryContent(type)}
              onSimpleFilterChange={(val) => setFilterValues(val)}
              openSaveModal={() => setShowSaveFilter(true)}
              onFilter={handleOnFilter}
              onReset={handleOnReset}
              setTab={setTab}
              onEdit={handleEditFilter}
              onFilterComplexChange={(val) => setFilterComplexValues(val)}
              errorComplexFilter={errorComplexFilter}
              showSaveFilter={showSaveFilter}
              noteFromProject={noteFromProject}
            />
          </ScaleFade>
        )}
        {showSaveFilter ? (
          <SaveFilterModal
            onClose={() => {
              setfilterMetadata(null)
              setShowSaveFilter(false)
              setIsUpdateFilter(false)
            }}
            filter={
              !changeValueFilter
                ? filterMetadata.query
                : tab === 0
                ? filterValues
                : filterComplexValues
            }
            filterMetadata={filterMetadata}
            isUpdateFilter={isUpdateFilter}
            type={tab === 0 ? "simple" : "complex"}
            object="notes"
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

        {!showSaveFilter && showSecondaryContent === "project" ? (
          <ProjectSupportModal
            isOpen={showSecondaryContent === "project"}
            onClose={() => setShowSecondaryContent(false)}
            onProjectSelect={handleProjectSelect}
          />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
