import { ICONS_REFERENCE } from "./icons"
import { PATHS } from "./global"

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
    href: PATHS.notes,
    disabled: false
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
    disabled: false,
    submenu: [
      {
        label: "VTI Code",
        icon: ICONS_REFERENCE.sector,
        href: PATHS.codes,
        disabled: false
      }
    ]
  },

  // TAGS
  tags: {
    label: "Tags",
    icon: ICONS_REFERENCE.tag_line,
    noEvents: true,
    disabled: false,
    submenu: [
      {
        label: "Proyecto",
        icon: ICONS_REFERENCE.tag_line,
        href: PATHS.projectTags,
        disabled: false
      },
      {
        label: "Apunte",
        icon: ICONS_REFERENCE.tag_line,
        href: PATHS.noteTags,
        disabled: false
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
        disabled: false
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
    label: "Suscripcion",
    icon: ICONS_REFERENCE.subscribe_line,
    href: PATHS.subscription,
    disabled: false
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
