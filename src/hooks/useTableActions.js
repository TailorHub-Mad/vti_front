import { useState } from "react"
import { MIN_TABLE_WIDTH } from "../utils/constants/layout"
import { getPercentage } from "../utils/functions/common"

const useTableActions = () => {
  const [selectedRows, setSelectedRows] = useState({})
  const calcColWidth = (width) => `${getPercentage(MIN_TABLE_WIDTH, width)}%`

  const handleRowSelect = (id) => {
    if (selectedRows[id]) {
      const _nextSelected = { ...selectedRows }
      delete _nextSelected[id]
      setSelectedRows(_nextSelected)
      return
    }
    setSelectedRows({ ...selectedRows, [id]: true })
  }

  const handleSelectAllRows = (items) => {
    if (items.length === Object.keys(selectedRows).length) {
      setSelectedRows({})
      return
    }

    const nextValues = items.reduce((obj, cv) => {
      const itemId = cv.id || cv._id
      const _next = { ...obj, [itemId]: true }
      return _next
    }, {})

    setSelectedRows(nextValues)
  }

  return {
    selectedRows,
    setSelectedRows,
    handleRowSelect,
    calcColWidth,
    handleSelectAllRows,
  }
}

export default useTableActions
