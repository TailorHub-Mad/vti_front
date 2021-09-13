import { useState } from "react"
import { MIN_TABLE_WIDTH } from "../utils/constants/layout"
import { getPercentage } from "../utils/functions/common"

const useTableActions = () => {
  const [selectedRows, setSelectedRows] = useState([])
  const calcColWidth = (width) => `${getPercentage(MIN_TABLE_WIDTH, width)}%`

  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      const nextItems = selectedRows.filter((item) => item !== id)
      setSelectedRows(nextItems)
      return
    }
    setSelectedRows([...selectedRows, id])
  }
  return { selectedRows, setSelectedRows, handleRowSelect, calcColWidth }
}

export default useTableActions
