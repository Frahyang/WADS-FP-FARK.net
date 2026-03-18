import React from 'react'
import { PriorityType } from '../../types/types'

interface Props {
  priority: PriorityType
}

const PriorityDisplay: React.FC<Props> = ({ priority }) => {
  const styles = {
    container: "px-2 py-1 rounded-md text-xs font-semibold w-fit ",

    "High": "bg-red-100 text-red-500",
    "Medium": "bg-yellow-100 text-yellow-600",
    "Low": "bg-green-100 text-green-500"
  }

  return (
    <div className={styles.container + styles[priority]}>
      {priority}
    </div>
  )
}

export default PriorityDisplay
