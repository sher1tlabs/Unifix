export type UserRole = 'student' | 'faculty' | 'staff' | 'admin';

export type DamageCategory = 
  | 'wall_masonry'
  | 'plumbing_leak'
  | 'electrical'
  | 'furniture_fixtures'
  | 'hvac_ac'
  | 'doors_windows'
  | 'cleanliness_hazard'
  | 'other';

export type BuildingBlock = 
  | 'AB-1'
  | 'AB-2'
  | 'Central Library'
  | 'Science & Tech Block'
  | 'Student Center & Cafeteria'
  | 'Boys Hostel 1'
  | 'Boys Hostel 2'
  | 'Girls Hostel 1'
  | 'Sports Complex'
  | 'Admin Complex';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus = 
  | 'reported'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  identifier: string; // Student ID or Staff ID
  email: string;
  phone: string; // PRIVATE!
  anonymizedAlias: string;
  avatar?: string;
}

export interface IssueComment {
  id: string;
  userId: string;
  userAlias: string;
  userRole: UserRole;
  text: string;
  timestamp: string;
  isOfficialAdminUpdate?: boolean;
}

export interface IssueReport {
  id: string;
  title: string;
  category: DamageCategory;
  building: BuildingBlock;
  room: string; // e.g. "Room no. 205 - AB-1"
  floor: string;
  landmark?: string;
  description: string;
  imageUrl: string;
  resolutionImageUrl?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  status: IssueStatus;
  priority: IssuePriority;
  reportedAt: string;
  reporterId: string;
  reporterAlias: string;
  // Confidential PII - Only visible to Admin:
  reporterName: string;
  reporterPhone: string;
  reporterEmail: string;
  reporterDepartment: string;
  upvotes: number;
  upvotedBy: string[]; // user ids
  assignedTeam?: string;
  assignedTech?: string;
  estimatedCompletion?: string;
  comments: IssueComment[];
}

export interface MaintenanceNotice {
  id: string;
  title: string;
  content: string;
  building: string;
  urgency: 'info' | 'warning' | 'urgent';
  date: string;
  author: string;
}
