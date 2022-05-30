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
      owner,
      link,
      description,
      clientAlias,
      createdAt,
      messages,
      documents,
      projects,
      testSystems,
      isClosed,
      formalized,
      tags
    } = note

    return {
      "ID DB": _id,
      "ID VTI": ref,
      Título: title,
      Autor: owner[0]?.name
        ? `${owner[0]?.name} ${owner[0]?.lastName || ""}`
        : "Sin autor",
      Proyecto: projects[0]?.alias || "Sin definir",
      Descripción: description,
      "Alias cliente": clientAlias,
      "Fecha de creación": new Date(createdAt).toLocaleDateString(),
      Enlace: link,
      "Documentos adjuntos": documents
        ? documents.map((dc) => dc.url).join(", ")
        : "Sin documentos",
      "Sistemas de ensayo": testSystems.map((ts) => ts.alias).join(", "),
      "Tags de apunte": tags.map((tag) => tag.name).join(", "),
      Abierto: isClosed ? "Si" : "No",
      Formalizado: formalized ? "Si" : "No",
      Mensajes: messages.map(
        (msg) =>
          msg.message &&
          `
      Autor: ${msg.owner[0]?.name} 
      Mensaje: ${msg.message}
      ${
        msg.documents && msg.documents[0]?.url
          ? `Adjuntos: ${msg.documents.map((doc) => doc.url).join(", ")}`
          : "Sin adjuntos"
      }
      ${msg.link ? `Link: ${msg.link}` : "Sin enlaces"}
      `
      )
    }
  })

  return _data
}
