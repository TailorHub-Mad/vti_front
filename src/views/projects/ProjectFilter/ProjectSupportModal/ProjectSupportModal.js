import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  useMediaQuery
} from "@chakra-ui/react"
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
import { CustomModalContent } from "../../../../components/overlay/Modal/CustomModalContent/CustomModalContent"

export const ProjectSupportModal = ({
  onClose,
  onProjectSelect,
  isOpen,
  ...props
}) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  const { getProjectHelps } = useHelpApi()
  const { getProjectTags } = useTagApi()
  const { getProjects, getFilterProjects } = useProjectApi()
  const { getClients } = useClientApi()
  const { getSystems } = useSystemApi()

  const [showTagSupportModal, setShowTagSupportModal] = useState(false)
  const [showProjectList, setShowProjectList] = useState(false)

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
    if (
      Object.values(values).some((value) =>
        Array.isArray(value) ? value.length > 0 : value
      )
    ) {
      const searchProjects = async () => {
        const query = generateFilterQuery(PROJECTS_FILTER_KEYS, values, true)
        const results = await getFilterProjects(null, query)
        setProjects(results && results[0]?.projects ? results[0]?.projects : [])
      }
      searchProjects()
    }
  }, [values])

  return (
    <>
      <Modal
        isOpen={isScreen && isOpen}
        onClose={() => {
          setValues({})
          fetchProjects()
          onClose()
        }}
      >
        <ModalOverlay zIndex="10002" />
        <CustomModalContent
          display="flex"
          bgColor="transparent"
          justifyContent="center"
          pt="50px"
          flexDirection="row"
          boxShadow="none"
          zIndex="10005"
        >
          <Box
            w={["100%", null, null, "460px"]}
            height="fit-content"
            position={["absolute", null, null, "relative"]}
            left={["0", null, null, null]}
            right={["0", null, null, null]}
            top={["0", null, null, null]}
            transition={[null, null, null, "left 0.18s ease-in-out"]}
            bgColor="white"
            padding="32px"
            zIndex="10005"
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
              zIndex="10005"
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
        </CustomModalContent>
      </Modal>
      <Modal
        isOpen={!isScreen && isOpen}
        onClose={() => {
          setValues({})
          fetchProjects()
          onClose()
        }}
      >
        <ModalOverlay zIndex="10002" />
        <CustomModalContent
          display="flex"
          bgColor="transparent"
          justifyContent="center"
          pt="0"
          flexDirection="row"
          boxShadow="none"
          zIndex="10005"
        >
          <Box
            w="100%"
            height="100vh"
            position="absolute"
            left="0"
            top="0"
            bgColor="white"
            padding="16px"
            zIndex="10005"
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
            </Box>
          </Box>
          <Flex
            position="fixed"
            zIndex="10010"
            bottom="0"
            left="0"
            right="0"
            margin="0 auto"
            w="100vw"
            h="68px"
            justifyContent="center"
            align="center"
            bgColor="white"
            boxShadow="0px -4px 8px rgba(5, 46, 87, 0.1)"
          >
            <Button
              disabled={showProjectList && !selectedProject}
              onClick={() =>
                showProjectList ? handleSubmit() : setShowProjectList(true)
              }
            >
              {showProjectList ? "Aplicar Proyecto" : "Aplicar Búsqueda"}
            </Button>
          </Flex>

          {!isScreen && showTagSupportModal ? (
            <SupportModal
              zIndex="10005"
              onClose={() => setShowTagSupportModal(false)}
              usedTags={usedProjectTags}
              criteria={projectCriteria}
              onTagsSelect={(tags) => handleTagSelect(tags, true)}
              selectedTags={values?.tag_project?.map((t) => t.label) || []}
              sx={{
                ">div:first-of-type": {
                  boxShadow: "0px 0px 8px rgba(5, 46, 87, 0.1)"
                }
              }}
            />
          ) : null}

          {!isScreen && showProjectList && (
            <ProjectListModal
              projects={projects}
              onSelectProject={(pr) => {
                handleProjectSelect(pr)
              }}
              selectedProject={selectedProject}
              zIndex="10006"
              w="100vw"
              h="100vh"
              top="0"
              left="0"
              m="0"
              p="0"
              headerConfig={{ onClose: () => setShowProjectList(false) }}
            />
          )}
        </CustomModalContent>
      </Modal>
    </>
  )
}
