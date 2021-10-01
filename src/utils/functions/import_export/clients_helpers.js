export const clientChecker = () => {}

export const clientDataTransform = (data) => {
  const items = [...data]
  items.shift()
  return items.map((item) => ({ alias: item.data[0], name: item.data[1] }))
}

export const transformClientsToExport = (data) => {
  const _data = data.map((client) => {
    const { _id, alias, name, testSystems, projects } = client
    return {
      _id,
      alias,
      name,
      testSystems: testSystems.map((ts) => ts.alias),
      projects: projects.map((pr) => pr.alias)
    }
  })
  return _data
}
