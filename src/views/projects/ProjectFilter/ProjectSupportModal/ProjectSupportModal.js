import { Box, Button, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { MOCK_YEAR_OPTIONS } from "../../../../mock/mock"
import { FormController } from "../../../../components/forms/FormItemWrapper/FormController"
import { InputSelect } from "../../../../components/forms/InputSelect/InputSelect"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import { ProjectListModal } from "../ProjectListModal/ProjectListModal"
import { SupportModal } from "../../../helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"
import useHelpApi from "../../../../hooks/api/useHelpApi"
import useTagApi from "../../../../hooks/api/useTagApi"
import useProjectApi from "../../../../hooks/api/useProjectApi"
import { MultiTagSelect } from "../../../../components/forms/MultiTagSelect/MultiTagSelect"
import useClientApi from "../../../../hooks/api/useClientApi"
import useSystemApi from "../../../../hooks/api/useSystemApi"
import { generateFilterQuery } from "../../../../utils/functions/filter"
import { PROJECTS_FILTER_KEYS } from "../../../../utils/constants/filter"

export const ProjectSupportModal = ({
  onClose,
  onProjectSelect,
  isOpen,
  ...props
}) => {
  const { getProjectHelps } = useHelpApi()
  const { getProjectTags } = useTagApi()
  const { getProjects, getFilterProjects } = useProjectApi()
  const { getClients } = useClientApi()
  const { getSystems } = useSystemApi()

  const [showTagSupportModal, setShowTagSupportModal] = useState(false)

  const [clientOptions, setClientOptions] = useState([])
  const [systemOptions, setSystemOptions] = useState([])

  const [values, setValues] = useState({
    test_system: "",
    client: "",
    tag_project: [],
    year: ""
  })

  const [tagsOptions, setTagsOptions] = useState([])
  const [usedProjectTags, setUsedProjectTags] = useState([])
  const [projectCriteria, setProjectCriteria] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  const [projects, setProjects] = useState([])

  //TODO Los formats se comparten en muchos filtros, podrían ir en utils
  const formatSystems = (_systems) => {
    if (_systems.length === 0) return []
    return _systems.map((system) => ({
      label: system.alias,
      value: system._id
    }))
  }

  const formatClients = (_clients) =>
    _clients.map((client) => ({ label: client.alias, value: client._id }))

  const handleTagSelect = (_tags) => {
    const refTags = values.tag_project
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
    setValues({
      ...values,
      tag_project: nextTags
    })
  }

  const handleFormChange = (input, _value) => {
    setValues({
      ...values,
      [input]: _value
    })
  }

  const handleProjectSelect = (_project) => {
    setSelectedProject(_project)
  }

  const formatTags = (_tags) =>
    _tags.map((tag) => ({ label: tag.name, value: tag._id }))

  const fetchProjects = async () => {
    const _data = await getProjects()
    setProjects(_data && _data[0]?.projects)
  }
  const handleSubmit = () => {
    const [_selectedProject] = projects.filter(
      (pro) => pro.alias === selectedProject
    )
    onProjectSelect({ label: _selectedProject.alias, value: _selectedProject._id })
    setValues({})
    onClose()
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
      setTagsOptions(formatTags(_used))
    }

    fetchCriteria()
    fetchTags()
    fetchProjects()
  }, [])

  useEffect(() => {
    const _getClients = async () => {
      const clients = await getClients()
      setClientOptions(formatClients(clients))
    }

    const _getSystems = async () => {
      const systems = await getSystems()
      setSystemOptions(formatSystems(systems[0]?.testSystems))
    }

    _getClients()
    _getSystems()
  }, [])

  useEffect(() => {
    console.log("VALUES", Object.values(values))
    if (
      Object.values(values).some((value) =>
        Array.isArray(value) ? value.length > 0 : value
      )
    ) {
      const searchProjects = async () => {
        const query = generateFilterQuery(PROJECTS_FILTER_KEYS, values, true)
        const results = await getFilterProjects(null, query)
        setProjects(results && results[0].projects)
      }
      searchProjects()
    }
  }, [values])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setValues({})
        fetchProjects()
        onClose()
      }}
    >
      <ModalOverlay />
      <ModalContent
        bgColor="transparent"
        justify="center"
        flexDirection="row"
        width="fit-content"
        maxWidth="100vw"
        boxShadow="none"
      >
        <Box
          width="460px"
          height="fit-content"
          position="relative"
          transition="left 0.18s ease-in-out"
          bgColor="white"
          padding="32px"
          {...props}
        >
          <CustomModalHeader
            title="Apoyo búsqueda de proyecto"
            onClose={() => {
              setValues({})
              fetchProjects()
              onClose()
            }}
          />
          <Box paddingTop="32px">
            <InputSelect
              options={systemOptions}
              name="test_system"
              label="Sistema de ensayo"
              placeholder="AliasSE"
              marginBottom="32px"
              onChange={(val) => handleFormChange("test_system", val)}
              value={values?.test_system}
            />
            <InputSelect
              name="client"
              options={clientOptions}
              label="Cliente"
              placeholder="AliasCL"
              marginBottom="32px"
              onChange={(val) => handleFormChange("client", val)}
              value={values?.client}
            />
            <MultiTagSelect
              options={tagsOptions}
              name="tag_project"
              label="Tag de proyecto"
              placeholder="Seleccione"
              marginBottom="32px"
              helper="Abrir ventana de apoyo"
              onHelperClick={() => setShowTagSupportModal(true)}
              onChange={(val) => handleFormChange("tag_project", val)}
              value={values?.tag_project}
            />
            <FormController label="Año de creación" marginBottom="32px">
              <InputSelect
                options={MOCK_YEAR_OPTIONS}
                name="year"
                placeholder="Año"
                marginBottom="32px"
                onChange={(val) => handleFormChange("year", val)}
                value={values?.year}
              />
            </FormController>
            <Button
              margin="0 auto"
              display="block"
              disabled={!selectedProject}
              onClick={handleSubmit}
            >
              Aplicar proyecto
            </Button>
          </Box>
        </Box>
        {showTagSupportModal ? (
          <SupportModal
            onClose={() => setShowTagSupportModal(false)}
            usedTags={usedProjectTags}
            criteria={projectCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags, true)}
            selectedTags={values?.tag_project?.map((t) => t.label) || []}
            position="relative"
            top="auto"
            left="auto"
            right="auto"
            ml="50px"
            sx={{
              ">div:first-of-type": {
                boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)"
              }
            }}
          />
        ) : (
          <ProjectListModal
            projects={projects}
            onSelectProject={handleProjectSelect}
            selectedProject={selectedProject}
          />
        )}
      </ModalContent>
    </Modal>
  )
}
