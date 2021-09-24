import nookies from "nookies"

export const getSessioncookie = () => nookies.get(undefined, "vti")

export const setSessioncookie = (token) =>
  nookies.set(undefined, "vti", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/"
  })

export const destroySessionCookie = () =>
  nookies.destroy(undefined, "vti", { path: "/" })
