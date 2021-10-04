export const tagChecker = () => {}

export const tagDataTransform = (data) => {
  const items = [...data]
  items.shift()
  const _items = items.map((item) => {
    const _item = {
      name: item.data[0],
      parent: item.data[1]
    }

    if (item.data[1]) {
      _item.parent
    }

    return _item
  })

  return _items
}

export const transformTagsToExport = (data) => {
  const _data = data.map((tag) => {
    const { id, name, parent, projects } = tag
    return {
      _id: id,
      name,
      parent: parent && parent?.name,
      projects: projects && projects?.map((pr) => pr?.alias)
    }
  })
  return _data
}
