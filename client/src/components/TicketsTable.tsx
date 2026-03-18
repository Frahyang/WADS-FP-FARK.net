import React from 'react'
import StatusDisplay from './StatusDisplay'
// import type { Ticket } from '../../../server/models/TicketModel'
import { Ticket } from '../../types/types'
interface Props {
  data: Ticket[]
}

const TicketsTable: React.FC<Props> = ({ data }) => {
  const styles = {
    table: 'table-fixed w-full',
    thead: 'border-b px-5 py-2 text-left bg-gray-100',
    tbody: 'text-sm px-5 py-2',
    trow: 'border-b-1 hover:bg-indigo-100 cursor-pointer transition-colors',
  }
  return (
    <div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.thead}>Ticket ID</th>
            <th className={styles.thead}>Title</th>
            <th className={styles.thead}>Type</th>
            <th className={styles.thead}>Status</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((ticket) => {
            return (
              <tr className={styles.trow}>
                <td className={styles.tbody}>{ticket.id}</td>
                <td className={styles.tbody}>{ticket.title}</td>
                <td className={styles.tbody}>{ticket.type}</td>
                <td className={styles.tbody}><StatusDisplay status={ticket.status} /></td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    </div>
  )
}

export default TicketsTable
