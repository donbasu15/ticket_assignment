export type UserRole = 'customer' | 'agent';

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: string;
  contactEmail: string;
  contactPhone: string | null;
  createdBy: string;
  assignedTo: string | null;
  attachmentUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}