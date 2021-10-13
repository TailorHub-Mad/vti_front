export const NOTES_FILTER_KEYS = {
  client: "notes.clientAlias",
  note_tags: "notes.tags",
  users: "notes.owner",
  test_system: "notes.testSystems._id",
  vti_code: "notes.vtiCode._id",
  project: "notes.projects._id",
  formalized: "notes.formalized",
  closed: "notes.isClosed",
  link: "notes.link"
}
export const PROJECTS_FILTER_KEYS = {
  client: "projects.clientAlias",
  test_system: "projects.testSystems._id",
  year: "projects.year",
  vti_code: "projects.vtiCode._id",
  focus_point: "projects.focusPoint",
  sector: "projects.sector._id",
  tag_project: "projects.tags.name"
}

export const TESTSYSTEMS_FILTER_KEYS = {
  client: "testSystems.clientAlias",
  year: "testSystems.year",
  vti_code: "testSystems.vtiCode",
  sector: "testSystems.projects.sector",
  project_tags: "testSystems.projects.tags.name"
}

export const TAGS_FILTER_KEYS = {
  project_tags: "tags.name",
  note_tags: "tags.name"
}

export const USERS_FILTER_KEYS = {
  project: "projectsComments._id",
  department: "department._id",
  focus_point: "focusPoint._id"
}
