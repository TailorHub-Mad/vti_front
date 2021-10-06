export const NOTES_FILTER_KEYS =  {
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
export const PROJECTS_FILTER_KEYS =  {
    client: "projects.clientAlias",
    test_system: "projects.testSystems._id",
    year: "projects.year",
    vti_code: "projects.vtiCode._id",
    focus_point: "projects.focusPoint",
    sector: "projects.sector._id",
    tag_project: "projects.tags.name",  
  }