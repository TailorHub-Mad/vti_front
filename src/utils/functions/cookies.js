import nookies from "nookies"

export const getSessioncookie = () => nookies.get(undefined, "vti")

export const setSessioncookie = (token) =>
  nookies.set(undefined, "vti", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  })

export const destroySessionCookie = () =>
  nookies.destroy(undefined, "vti", { path: "/" })

export const setRefreshCookie = (token) =>
  nookies.set(undefined, "vti_rt", token, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  })

export const destroyRefreshCookie = () =>
  nookies.destroy(undefined, "vti_rt", { path: "/" })
