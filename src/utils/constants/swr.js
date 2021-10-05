export const SWR_CACHE_KEYS = {
  // AUTH
  me: "/me",

  // NOTES
  notes: "notes/",
  note: "note/",
  groupNotes: "notes/group",
  filterNotes: "notes/filter",
  searchNotes: "notes/search",
  favsNotes: "notes/favs",
  subscribeNotes: "notes/subscribe",
  unreadNotes: "notes/unread",
  activeNotes: "notes/active",

  // PROJECTS
  projects: "projects/",
  project: "project/",
  groupProjects: "projects/group",
  activeProjects: "projects/active",
  filterProjects: "projects/filter",
  searchProjects: "projects/search",

  // SYSTEMS
  systems: "systems/",
  system: "system/",
  groupSystems: "systems/group",
  filterSystems: "systems/filter",
  searchSystems: "systems/search",

  // CLIENTS
  clients: "clietns/",
  client: "client/",

  // SECTORS
  sectors: "sectors/",
  sector: "sector/",

  // DEPARTMENTS
  departments: "departments/",
  department: "department/",

  // USERS
  users: "users/",
  user: "user/",
  groupUsers: "users/group",

  // TAGS
  projectTags: "projectTags/",
  noteTags: "noteTags/",
  searchProjectTags: "projectTags/search",
  searchNoteTags: "noteTags/search"
}

export const fetchType = {
  ALL: "all",
  ID: "id",
  ACTIVE: "active",
  GROUP: "group",
  FILTER: "filter",
  SEARCH: "search"
}

export const fetchOption = {
  ID: "id",
  GROUP: "group",
  FILTER: "filter",
  SEARCH: "search"
}
