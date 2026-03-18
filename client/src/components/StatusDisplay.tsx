import React from 'react'
import { StatusType } from '../../types/types'

interface Props {
  status: StatusType
}

const StatusDisplay: React.FC<Props> = ({ status }) => {
  const styles = {
    container: "px-2 py-1 rounded-md text-xs font-semibold w-fit ",

    "In Progress": "bg-blue-100 text-blue-600",
    "Completed": "bg-green-100 text-green-600",
    "Unseen": "bg-gray-100 text-gray-600"
  }

  return (
    <div className={styles.container + styles[status]}>
      {status}
    </div>
  )
}

export default StatusDisplay
