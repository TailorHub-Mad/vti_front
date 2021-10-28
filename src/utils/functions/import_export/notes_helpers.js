export const noteChecker = () => {}

export const noteDataTransform = (data) => {
  const items = [...data]
  items.shift()
  return items.map((item) => {
    const _item = {
      title: item.data[0],
      description: item.data[1],
      project: item.data[2]
    }

    if (item.data[3]) {
      _item.link = item.data[3]
    }
    if (item.data[4]) {
      _item.testSystems = item.data[4].split(" ").map((item) => item.trim())
    }
    if (item.data[5]) {
      _item.tags = item.data[5].split(" ").map((item) => item.trim())
    }
    return _item
    //De momento no es posible importar notas con documentos adjuntos
  })
}

export const transformNotesToExport = (data) => {
  const _data = data.map((note) => {
    const {
      _id,
      ref,
      title,
      link,
      description,
      clientAlias,
      createdAt,
      documents,
      testSystems,
      tags
    } = note
    return {
      _id,
      ref,
      title,
      description,
      clientAlias,
      createdAt: new Date(createdAt).toLocaleDateString(),
      link,
      documents: documents && documents.map((dc) => dc.url),
      testSystems: testSystems.map((ts) => ts.alias),
      tags: tags.map((tag) => tag.name)
    }
  })

  //De momento no es posible exportar notas con los mensajes asociados.
  return _data
}
