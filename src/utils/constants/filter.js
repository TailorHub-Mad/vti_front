export const NOTES_FILTER_KEYS = {
  client: "notes.clientAlias",
  note_tags: "notes.tags._id",
  project_tags: "notes.projects.tags",
  users: "notes.owner._id",
  test_system: "notes.testSystems._id",
  vti_code: "notes.testSystems.vtiCode",
  project: "notes.projects._id",
  formalized: "notes.formalized",
  closed: "notes.isClosed",
  opened: "notes.isClosed",
  only_suscribed: "subscribed",
  only_favs: "favorites",
  only_unread: "noRead",
  with_links: "notes.isDocuments",
  with_responses: "notes.isAnswered",
  date: "notes.createdAt",
  dateFrom: "notes",
  dateTo: "notes"
}
export const PROJECTS_FILTER_KEYS = {
  client: "projects.clientId",
  clientAlias: "projects.clientAlias",
  test_system: "projects.testSystems._id",
  year: "projects.date.year",
  vti_code: "projects.testSystems.vtiCode",
  focus_point: "projects.focusPoint._id",
  sector: "projects.sector._id",
  tag_project: "projects.tags._id"
}

export const TESTSYSTEMS_FILTER_KEYS = {
  client: "testSystems.clientAlias",
  year: "testSystems.date.year",
  vti_code: "testSystems.vtiCode",
  sector: "testSystems.projects.sector",
  project_tags: "testSystems.projects.tags"
}

export const TAGS_FILTER_KEYS = {
  project_tags: "_id",
  note_tags: "_id"
}

export const USERS_FILTER_KEYS = {
  project: "projectsComments._id",
  department: "department._id",
  focus_point: "focusPoint.focusPoint"
}

export const NOTIFICATIONS_FILTER_KEYS = {
  name: "projectsComments._id"
}
