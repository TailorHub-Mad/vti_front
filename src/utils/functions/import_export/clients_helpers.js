export const clientChecker = () => {}

export const clientDataTransform = (data) => {
  const items = [...data]
  items.shift()
  return items.map((item) => ({ alias: item.data[0], name: item.data[1] }))
}

export const transformClientsToExport = (data) => {
  const _data = data.map((client) => {
    const { _id, ref, alias, name, testSystems, projects } = client
    return {
      "ID DB": _id,
      "ID VTI": ref,
      Alias: alias,
      Nombre: name,
      "Sistemas de ensayo": testSystems.map((ts) => ts.alias).join(", "),
      Proyectos: projects.map((pr) => pr.alias).join(", ")
    }
  })
  return _data
}
