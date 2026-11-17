export type TicketCategory = 
  | 'Academic'
  | 'Finance'
  | 'Housing & Mess'
  | 'IT Services'
  | 'Library'
  | 'Health & Counseling';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketStatus = 'Open' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';

export type CampusBlockLetter = 
  | 'Block A' | 'Block B' | 'Block C' | 'Block D' | 'Block E'
  | 'Block F' | 'Block G' | 'Block H' | 'Block I' | 'Block J'
  | 'Block K' | 'Block L' | 'Block M' | 'Block N' | 'Block O'
  | 'Block P' | 'Block Q' | 'Block R' | 'Block S';

export type EventCategory = 
  | 'Cultural & Arts'
  | 'Technical & Hackathon'
  | 'Clan Competition'
  | 'Sports & Athletics'
  | 'Academic & Symposium'
  | 'Workshop & Masterclass';

export interface CampusEvent {
  id: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  date: string; // ISO format or display date
  time: string; // e.g. "10:00 AM - 4:30 PM"
  block: CampusBlockLetter;
  venueDetails: string; // e.g. "Main Auditorium (M-101)" or "Robotics Lab (B-204)"
  organizer: string; // e.g. "Department of Student Welfare (DSW)", "Clan Wild Cats", "IEEE MRU"
  facultyCoordinator: {
    name: string;
    designation: string;
    contact: string;
  };
  studentCoordinator: {
    name: string;
    clanOrBranch: string;
    contact: string;
  };
  description: string;
  highlights: string[];
  registrationStatus: 'Open' | 'Closing Soon' | 'Free Pass' | 'Completed';
  capacity: number;
  registeredCount: number;
  clanPointsAwarded?: number;
  entryFee?: string;
}

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
  code: CampusBlockLetter | string;
  blockLetter: CampusBlockLetter;
  category: 'Academic' | 'Administrative' | 'Residential' | 'Library' | 'Recreation' | 'Health' | 'Innovation';
  description: string;
  hours: string;
  image?: string;
  coordinates: { x: number; y: number };
  floors: { floor: string; departments: string[] }[];
}

export type PhotoCategory = 
  | 'All' 
  | 'Academic Blocks' 
  | 'Library & Study' 
  | 'Auditoriums & Halls' 
  | 'Sports & Outdoors' 
  | 'Student Hangouts';

export interface CampusPhoto {
  id: string;
  url: string;
  title: string;
  category: PhotoCategory;
  block?: CampusBlockLetter | string;
  location: string;
  description: string;
  featured?: boolean;
}

