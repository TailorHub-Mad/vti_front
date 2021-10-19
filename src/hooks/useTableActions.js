import { useState } from "react"

const useTableActions = (isGrouped) => {
  const [selectedRows, setSelectedRows] = useState({})

  const handleRowSelect = (id, key) => {
    if (selectedRows[id]) {
      const _nextSelected = { ...selectedRows }
      delete _nextSelected[id]
      setSelectedRows(_nextSelected)
      return
    }

    isGrouped
      ? setSelectedRows({ ...selectedRows, [id]: { active: true, key } })
      : setSelectedRows({ ...selectedRows, [id]: true })
  }

  const handleSelectAllRows = (items) => {
    if (items.length === Object.keys(selectedRows).length) {
      setSelectedRows({})
      return
    }

    const nextValues = items.reduce((obj, cv) => {
      const itemId = cv?.id?.value || cv?._id
      const _next = { ...obj, [itemId]: true }
      return _next
    }, {})

    setSelectedRows(nextValues)
  }

  return {
    selectedRows,
    setSelectedRows,
    handleRowSelect,
    handleSelectAllRows
  }
}

export default useTableActions
