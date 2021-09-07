import { ICONS_REFERENCE } from "./icons_reference"

const TABBAR_LINKS = {
  new_note: {
    label: "Nuevo apunte",
    icon: ICONS_REFERENCE.new_note,
    href: "/notas/nueva",
  },
  notes: {
    label: "Apuntes",
    icon: ICONS_REFERENCE.notes,
    href: "/apuntes/",
  },
  projects: {
    label: "Proyectos",
    icon: ICONS_REFERENCE.project_line,
    href: "/proyectos",
    submenu: [
      {
        label: "Sectores",
        icon: ICONS_REFERENCE.sector,
        href: "/sectores",
      },
    ],
  },
  test_systems: {
    label: "Sistemas ensayo",
    icon: ICONS_REFERENCE.machine_line,
    href: "/sistemas",
  },
  tags: {
    label: "Tags",
    icon: ICONS_REFERENCE.tag_line,
    submenu: [
      {
        label: "Proyecto",
        icon: ICONS_REFERENCE.tag_line,
        href: "/tags-de-proyecto",
      },
      {
        label: "Apunte",
        icon: ICONS_REFERENCE.tag_line,
        href: "/tags-de-apunte",
      },
    ],
  },
  clients: {
    label: "Clientes",
    icon: ICONS_REFERENCE.clients_line,
    href: "/clientes",
  },
  users: {
    label: "Usuarios",
    icon: ICONS_REFERENCE.users_line,
    href: "/",
    submenu: [
      {
        label: "Departamentos",
        icon: ICONS_REFERENCE.departments,
        href: "/departamentos",
      },
    ],
  },
  help: {
    label: "Apoyo",
    icon: ICONS_REFERENCE.help_line,
    href: "/",
  },
  subscription: {
    label: "Subscripción",
    icon: ICONS_REFERENCE.subscribe_line,
    href: "/",
  },
}
const {
  new_note,
  notes,
  projects,
  test_systems,
  tags,
  clients,
  users,
  help,
  subscription,
} = TABBAR_LINKS

export const TABBAR_USER_LINKS = [
  new_note,
  notes,
  projects,
  test_systems,
  tags,
  subscription,
]

export const TABBAR_ADMIN_LINKS = [
  notes,
  projects,
  test_systems,
  tags,
  clients,
  users,
  help,
  subscription,
]
