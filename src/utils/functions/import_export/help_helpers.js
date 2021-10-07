export const helpChecker = () => {}

export const helpDataTransform = (data) => {
  const items = [...data]
  items.shift()
  return items.map((item) => ({ alias: item.data[0], name: item.data[1] }))
}

export const transformHelpsToExport = (data) => {
  const _data = data.map((help) => {
    const { _id, alias, name, testSystems, projects } = help
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
