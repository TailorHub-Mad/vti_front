import React, { useState } from 'react'
import { MIN_TABLE_WIDTH } from '../utils/constants/layout'
import { getPercentage } from '../utils/functions/common'

const useTableActions = () => {
    const [selectedRows, setSelectedRows] = useState([])
    const calcColWidth = (width) => `${getPercentage(MIN_TABLE_WIDTH, width)}%`
  
    const handleRowSelect = (idx) => {
      if (selectedRows.includes(idx)) {
        const nextItems = selectedRows.filter((item) => item !== idx)
        setSelectedRows(nextItems)
        return
      }
      setSelectedRows([...selectedRows, idx])
    }
    return {selectedRows, setSelectedRows, handleRowSelect, calcColWidth}
}

export default useTableActions