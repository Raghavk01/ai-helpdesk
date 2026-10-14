export type TicketCategory = 
  | 'Academic'
  | 'Finance'
  | 'Housing & Mess'
  | 'IT Services'
  | 'Library'
  | 'Health & Counseling';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';

export interface TicketUpdate {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isOfficial?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  studentName: string;
  studentId: string;
  studentEmail: string;
  departmentAssigned: string;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  updates: TicketUpdate[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedFollowups?: string[];
  rating?: 'up' | 'down';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: TicketCategory;
  department: string;
  officerInCharge: string;
  contactEmail: string;
  officeHours: string;
  steps?: string[];
  documentsRequired?: string[];
}

export interface DepartmentContact {
  id: string;
  name: string;
  building: string;
  room: string;
  phone: string;
  email: string;
  hours: string;
  leadOfficer: string;
  services: string[];
}

export interface CourseGradeRow {
  id: string;
  code: string;
  title: string;
  credits: number;
  grade: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  category: 'Academic' | 'Administrative' | 'Residential' | 'Library' | 'Recreation' | 'Health';
  description: string;
  hours: string;
  image?: string;
  coordinates: { x: number; y: number };
  floors: { floor: string; departments: string[] }[];
}
