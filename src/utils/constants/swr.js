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

  // CODES
  codes: "codes/",
  code: "code/",
  searchCodes: "codes/search",

  // CLIENTS
  clients: "clients/",
  client: "client/",
  searchClients: "clients/search",

  // SECTORS
  sectors: "sectors/",
  sector: "sector/",
  searchSectors: "sectors/search",

  // DEPARTMENTS
  departments: "departments/",
  department: "department/",
  searchDepartments: "departments/search",

  // USERS
  users: "users/",
  user: "user/",
  groupUsers: "users/group",
  searchUsers: "users/search",

  // TAGS
  projectTags: "projectTags/",
  noteTags: "noteTags/",
  searchProjectTags: "projectTags/search",
  searchNoteTags: "noteTags/search",
  filterProjectTags: "projectTags/filter",
  filterNoteTags: "noteTags/filter",

  // HELPS
  projectHelps: "projectHelps/",
  noteHelps: "noteHelps/",
  searchProjectHelps: "projectHelps/search",
  searchNoteHelps: "noteHelps/search",

  // NOTIFICATIONS
  notifications: "notifications",
  notification: "notification",
  filterNotifications: "notifications/filter",
  searchNotifications: "notifications/search",
  notesNotifications: "notifications/notes",
  containersNotifications: "notifications/container",
  manteinanceNotifications: "notifications/manteinance",
  behaviourNotifications: "notifications/behaviour",
  fixedNotifications: "notifications/fixed"
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
  ORDER: "order",
  GROUP: "group",
  FILTER: "filter",
  SEARCH: "search"
}
