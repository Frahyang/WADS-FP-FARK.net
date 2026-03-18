export type StatusType = "In Progress" | "Completed" | "Unseen"
export type IssueType = "IT System" | "Management"
export type PriorityType = "High" | "Medium" | "Low";

export interface ITicket {
  ticket_id: string;
  owner_id: string;
  title: string;
  description: string;
  assignee: string;
  type: IssueType;
  date_created: Date;
  priority: PriorityType;
  status: StatusType;
}

export interface Ticket {
  id: string
  title: string
  assignee: string
  type: string
  dateCreated: string
  priority: PriorityType
  status: StatusType
}
