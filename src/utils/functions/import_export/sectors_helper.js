export const sectorChecker = () => {}

export const sectorDataTransform = (data) => {
  const items = [...data]
  items.shift()
  const _items = items.map((item) => {
    const _item = {
      title: item.data[0]
    }
    return _item
  })

  return _items
}

export const transformSectorsToExport = (data) => {
  const _data = data.map((sector) => {
    const { _id, title, projects } = sector
    return {
      _id,
      title,
      projects
    }
  })
  return _data
}
