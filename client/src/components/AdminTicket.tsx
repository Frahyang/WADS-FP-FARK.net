import React, { useState } from "react";
import { ITicket } from "../../types/types";
import type { PriorityType, StatusType } from "../../types/types";
import PriorityDisplay from "./PriorityDisplay";
import StatusDisplay from "./StatusDisplay";
import AdminTicketPopup from "./AdminTicketPopUp";
import { ticketService } from "../api/api";

interface Props extends ITicket {
  onTicketUpdate?: () => void;
}

const AdminTicket: React.FC<Props> = ({
  ticket_id,
  owner_id,
  title,
  description,
  assignee,
  type,
  date_created,
  priority,
  status,
  onTicketUpdate,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const styles = {
    cell: "py-3 px-2 sm:px-4 text-sm border-b whitespace-nowrap",
    titleCell: "py-3 px-2 sm:px-4 text-sm border-b max-w-[200px] truncate"
  }

  const handleRowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(prev => !prev);
  };

  const handleTicketUpdate = async (ticketId: string, updates: { status?: StatusType; priority?: PriorityType }) => {
    await ticketService.updateTicket(ticketId, updates);
    if (onTicketUpdate) {
      onTicketUpdate();
    }
  };

  const handleTicketDelete = async (ticketId: string) => {
    await ticketService.deleteTicket(ticketId);
    if (onTicketUpdate) {
      onTicketUpdate();
    }
  };

  return (
    <>
      <tr
        className="hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={handleRowClick}
        role="button"
        tabIndex={0}
      >
        <td className={styles.cell}>{ticket_id}</td>
        <td className={styles.titleCell} title={title}>{title}</td>
        <td className={styles.cell}>{assignee}</td>
        <td className={styles.cell}>{type}</td>
        <td className={styles.cell}>{new Date(date_created).toLocaleDateString()}</td>
        <td className={styles.cell}>
          <PriorityDisplay priority={priority} />
        </td>
        <td className={styles.cell}>
          <StatusDisplay status={status} />
        </td>
      </tr>

      {isPopupOpen && (
        <AdminTicketPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          ticket={{
            id: ticket_id,
            ownerId: owner_id.toString(),
            title: title,
            description: description,
            assignee: assignee,
            type: type,
            dateCreated: new Date(date_created).toLocaleDateString(),
            priority: priority,
            status: status,
          }}
          onUpdate={handleTicketUpdate}
          onDelete={handleTicketDelete}
        />
      )}
    </>
  );
};

export default AdminTicket;
