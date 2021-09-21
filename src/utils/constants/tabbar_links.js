import { ICONS_REFERENCE } from "./icons_reference"
import { PATHS } from "./paths"

const TABBAR_LINKS = {
  // NOTES
  new_note: {
    label: "Nuevo apunte",
    icon: ICONS_REFERENCE.new_note,
    href: PATHS.newNote
  },
  notes: {
    label: "Apuntes",
    icon: ICONS_REFERENCE.notes,
    href: PATHS.notes
  },

  // PROJECTS
  projects: {
    label: "Proyectos",
    icon: ICONS_REFERENCE.project_line,
    href: PATHS.projects
  },
  projects_admin: {
    label: "Proyectos",
    icon: ICONS_REFERENCE.project_line,
    href: PATHS.projects,
    submenu: [
      {
        label: "Sectores",
        icon: ICONS_REFERENCE.sector,
        href: PATHS.sectors
      }
    ]
  },

  // TEST SYSTEMS
  test_systems: {
    label: "Sistemas ensayo",
    icon: ICONS_REFERENCE.machine_line,
    href: PATHS.testSystems
  },

  // TAGS
  tags: {
    label: "Tags",
    icon: ICONS_REFERENCE.tag_line,
    href: PATHS.projectTags,
    submenu: [
      {
        label: "Proyecto",
        icon: ICONS_REFERENCE.tag_line,
        href: PATHS.projectTags
      },
      {
        label: "Apunte",
        icon: ICONS_REFERENCE.tag_line,
        href: PATHS.noteTags
      }
    ]
  },

  // CLIENTS
  clients: {
    label: "Clientes",
    icon: ICONS_REFERENCE.clients_line,
    href: PATHS.clients
  },

  // USERS
  users: {
    label: "Usuarios",
    icon: ICONS_REFERENCE.users_line,
    href: PATHS.users,
    submenu: [
      {
        label: "Departamentos",
        icon: ICONS_REFERENCE.departments,
        href: PATHS.departments
      }
    ]
  },

  // HELP
  help: {
    label: "Apoyo",
    icon: ICONS_REFERENCE.help_line,
    href: PATHS.help
  },

  // SUBSCRIPTION
  subscription: {
    label: "Subscripción",
    icon: ICONS_REFERENCE.subscribe_line,
    href: PATHS.subscription
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
