export const RoleType = {
  USER: "user",
  ADMIN: "admin"
}

export const DeleteType = {
  ONE: "deleteOne",
  MANY: "deleteMany"
}

export const TOAST_DEFAULT_TIME = 2000

export const PATHS = {
  root: "/",
  notFound: "/404",
  login: "/login",
  sendAccess: "/enviar-acceso",
  createAccess: "/crear-acceso",
  recoveryAccess: "/recuperar-acceso",
  notes: "/apuntes",
  newNote: "/apuntes/nuevo",
  projects: "/proyectos",
  sectors: "/sectores",
  testSystems: "/sistemas",
  codes: "/codigos",
  projectTags: "/tags/proyecto",
  noteTags: "/tags/apunte",
  clients: "/clientes",
  departments: "/departamentos",
  users: "/usuarios",
  help: "/apoyo",
  subscriptions: "/suscripciones",
  notifications: "/notificaciones"
}

export const WHITE_LIST = [
  PATHS.login,
  PATHS.sendAccess,
  "/crear-acceso/[id]",
  "/recuperar-acceso/[id]"
]
