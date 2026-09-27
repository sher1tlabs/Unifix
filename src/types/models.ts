// Campus Categories strictly requested by user:
// 1. All Campus
// 2. AB - 1
// 3. AB - 2
// 4. AB - 3
// 5. FACULTY BLOCK 1
// 6. FACULTY BLOCK 2
// 7. Library
// 8. Central Cafeteria Block

export const CAMPUS_CATEGORIES = [
  'All Campus',
  'AB - 1',
  'AB - 2',
  'AB - 3',
  'FACULTY BLOCK 1',
  'FACULTY BLOCK 2',
  'Library',
  'Central Cafeteria Block'
] as const;

export type CampusCategory = typeof CAMPUS_CATEGORIES[number];
export type PostLocationCategory = Exclude<CampusCategory, 'All Campus'>;

export type UserRole = 'student' | 'admin';

export interface StudentAccount {
  id: string;
  universityEmail: string;
  registrationNumber: string;
  passwordHash: string; // locally stored mock password
  createdAt: string;
}

export interface AdminAccount {
  id: string;
  adminEmail: string;
  passwordHash: string;
  name: string;
}

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
  registrationNumber?: string;
  displayName: string;
}

export interface PostReply {
  id: string;
  authorRole: 'admin' | 'student';
  authorDisplay: string;
  message: string;
  timestamp: string;
}

export interface Post {
  id: string;
  authorId: string;
  title: string;
  locationCategory: PostLocationCategory;
  roomDetails: string; // e.g. "Room no. 205"
  description: string;
  imageUrl?: string;
  createdAt: string;
  status: 'Open' | 'Under Review' | 'In Progress' | 'Resolved';
  replies: PostReply[];
}
