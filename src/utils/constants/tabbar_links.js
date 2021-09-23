import { ICONS_REFERENCE } from "./icons_reference"
import { PATHS } from "./paths"

const TABBAR_LINKS = {
  // NOTES
  new_note: {
    label: "Nuevo apunte",
    icon: ICONS_REFERENCE.new_note,
    href: PATHS.newNote,
    disabled: true // TODO -> provisional
  },
  notes: {
    label: "Apuntes",
    icon: ICONS_REFERENCE.notes,
    href: PATHS.notes,
    disabled: false
  },

  // PROJECTS
  projects: {
    label: "Proyectos",
    icon: ICONS_REFERENCE.project_line,
    href: PATHS.projects,
    disabled: true // TODO -> provisional
  },
  projects_admin: {
    label: "Proyectos",
    icon: ICONS_REFERENCE.project_line,
    href: PATHS.projects,
    disabled: false,
    submenu: [
      {
        label: "Sectores",
        icon: ICONS_REFERENCE.sector,
        href: PATHS.sectors,
        disabled: false
      }
    ]
  },

  // TEST SYSTEMS
  test_systems: {
    label: "Sistemas ensayo",
    icon: ICONS_REFERENCE.machine_line,
    href: PATHS.testSystems,
    disabled: false
  },

  // TAGS
  tags: {
    label: "Tags",
    icon: ICONS_REFERENCE.tag_line,
    href: PATHS.projectTags,
    disabled: true, // TODO -> provisional
    submenu: [
      {
        label: "Proyecto",
        icon: ICONS_REFERENCE.tag_line,
        href: PATHS.projectTags,
        disabled: true // TODO -> provisional
      },
      {
        label: "Apunte",
        icon: ICONS_REFERENCE.tag_line,
        href: PATHS.noteTags,
        disabled: true // TODO -> provisional
      }
    ]
  },

  // CLIENTS
  clients: {
    label: "Clientes",
    icon: ICONS_REFERENCE.clients_line,
    href: PATHS.clients,
    disabled: false
  },

  // USERS
  users: {
    label: "Usuarios",
    icon: ICONS_REFERENCE.users_line,
    href: PATHS.users,
    disabled: false,
    submenu: [
      {
        label: "Departamentos",
        icon: ICONS_REFERENCE.departments,
        href: PATHS.departments,
        disabled: true
      }
    ]
  },

  // HELP
  help: {
    label: "Apoyo",
    icon: ICONS_REFERENCE.help_line,
    href: PATHS.help,
    disabled: true // TODO -> provisional
  },

  // SUBSCRIPTION
  subscription: {
    label: "Subscripción",
    icon: ICONS_REFERENCE.subscribe_line,
    href: PATHS.subscription,
    disabled: true // TODO -> provisional
  }
}

const {
  new_note,
  notes,
  projects,
  projects_admin,
  test_systems,
  tags,
  clients,
  users,
  help,
  subscription
} = TABBAR_LINKS

export const TABBAR_USER_LINKS = [
  new_note,
  notes,
  projects,
  test_systems,
  tags,
  subscription
]

export const TABBAR_ADMIN_LINKS = [
  notes,
  projects_admin,
  test_systems,
  tags,
  clients,
  users,
  help,
  subscription
]
