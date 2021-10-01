export const testSystemChecker = (data) => {
  console.log(data)
}

export const testSystemDataTransform = (data) => {
  const items = [...data]
  items.shift()
  const _items = items.map((item) => {
    const _item = {
      vtiCode: item.data[0],
      alias: item.data[1],
      client: item.data[3]
    }

    if (item.data[2]) {
      _item.date = {
        year: item.data[2]
      }
    }

    return _item
  })

  return _items
}

export const transformTestSystemsToExport = (data) => {
  const _data = data.map((project) => {
    const { _id, alias, clientAlias, vtiCode, date, projects, notes } = project
    return {
      _id,
      alias,
      client: clientAlias,
      vtiCode,
      year: date?.year,
      projects: projects.map((pr) => pr.alias),
      notes: notes?.map((note) => note._id)
    }
  })
  return _data
}
