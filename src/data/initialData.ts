import { IssueReport, MaintenanceNotice, User } from '../types';

import wallCrackImg from '../assets/images/uni_wall_crack_damage_1790275173929.jpg';
import ceilingPipeImg from '../assets/images/uni_leaking_ceiling_pipe_1790275186799.jpg';
import brokenChairImg from '../assets/images/uni_broken_lecture_chair_1790275199999.jpg';
import campusHeroImg from '../assets/images/uni_campus_admin_hero_1790275211203.jpg';

export { wallCrackImg, ceilingPipeImg, brokenChairImg, campusHeroImg };

export const PRESET_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Adnan Sher',
    role: 'student',
    department: 'Department of Computer Science',
    identifier: 'CS-2024-884',
    email: 'adnanshersb@gmail.com',
    phone: '+92 333 4567890',
    anonymizedAlias: 'Student #492 · CS Dept',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Adnan'
  },
  {
    id: 'user-admin-1',
    name: 'Engr. Tariq Mehmood',
    role: 'admin',
    department: 'Estate, Infrastructure & Works Office',
    identifier: 'ESTATE-DIR-01',
    email: 'estate.admin@campus.edu',
    phone: '+92 300 5551234',
    anonymizedAlias: 'Estate Admin Official',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=EstateAdmin'
  },
  {
    id: 'user-student-2',
    name: 'Ayesha Malik',
    role: 'student',
    department: 'Electrical Engineering',
    identifier: 'EE-2023-112',
    email: 'ayesha.m@campus.edu',
    phone: '+92 312 9876543',
    anonymizedAlias: 'Student #108 · Engineering',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ayesha'
  },
  {
    id: 'user-faculty-1',
    name: 'Dr. Farhan Qazi',
    role: 'faculty',
    department: 'Physics & Applied Sciences',
    identifier: 'FAC-PHY-402',
    email: 'f.qazi@campus.edu',
    phone: '+92 321 4443322',
    anonymizedAlias: 'Faculty Member #55',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Farhan'
  }
];

export const INITIAL_NOTICES: MaintenanceNotice[] = [
  {
    id: 'notice-1',
    title: 'Emergency Plumbing Line Inspection in AB-1',
    content: 'Estate works crew is servicing central water risers in Academic Block 1. Restrooms on 2nd floor will undergo water valve maintenance between 2:00 PM and 4:30 PM today.',
    building: 'AB-1',
    urgency: 'warning',
    date: 'Today, 10:15 AM',
    author: 'Estate Office Dispatch'
  },
  {
    id: 'notice-2',
    title: 'Central Library Air Conditioning Upgrade Completed',
    content: 'All cooling chillers on 1st & 2nd floors have been balanced and filters replaced following student reports. Please report any uneven airflow.',
    building: 'Central Library',
    urgency: 'info',
    date: 'Yesterday',
    author: 'HVAC Unit'
  }
];

export const INITIAL_ISSUES: IssueReport[] = [
  {
    id: 'issue-101',
    title: 'Deep structural plaster crack and paint peeling',
    category: 'wall_masonry',
    building: 'AB-1',
    room: 'Room no. 205 - AB-1',
    floor: '2nd Floor',
    landmark: 'Beside lecture podium, near rear whiteboard',
    description: 'During morning Calculus class in Room 205, plaster fragments started crumbling from the vertical wall joint behind the side rows. Needs masonry inspection before it spreads.',
    imageUrl: wallCrackImg,
    status: 'assigned',
    priority: 'high',
    reportedAt: 'Today, 9:20 AM',
    reporterId: 'user-student-1',
    reporterAlias: 'Student #492 · CS Dept',
    reporterName: 'Adnan Sher',
    reporterPhone: '+92 333 4567890',
    reporterEmail: 'adnanshersb@gmail.com',
    reporterDepartment: 'Computer Science',
    upvotes: 18,
    upvotedBy: ['user-student-2', 'user-faculty-1'],
    assignedTeam: 'Civil & Masonry Works Crew',
    assignedTech: 'Foreman Bashir & Team',
    estimatedCompletion: 'Today, 5:00 PM',
    comments: [
      {
        id: 'c-1',
        userId: 'user-student-2',
        userAlias: 'Student #108 · Engineering',
        userRole: 'student',
        text: 'Can confirm, saw this during the 8:30 AM lecture. Some loose mortar fell on the corner bench.',
        timestamp: '9:35 AM'
      },
      {
        id: 'c-2',
        userId: 'user-admin-1',
        userAlias: 'Estate Admin Official',
        userRole: 'admin',
        text: 'Work order #CW-408 issued. Civil contractor is on-site today to scrap, re-plaster and seal the joint. Room will remain accessible after 4 PM.',
        timestamp: '10:05 AM',
        isOfficialAdminUpdate: true
      }
    ]
  },
  {
    id: 'issue-102',
    title: 'Ceiling water leak dripping onto corridor tiles',
    category: 'plumbing_leak',
    building: 'Science & Tech Block',
    room: '3rd Floor Corridor, near Chem Lab 304',
    floor: '3rd Floor',
    landmark: 'Directly outside Chemistry Instrument Room',
    description: 'Persistent water seepage through the drop ceiling panel. Water is pooling on smooth tiles, creating a severe slip hazard for students moving between practical labs.',
    imageUrl: ceilingPipeImg,
    status: 'in_progress',
    priority: 'critical',
    reportedAt: 'Today, 8:40 AM',
    reporterId: 'user-faculty-1',
    reporterAlias: 'Faculty Member #55',
    reporterName: 'Dr. Farhan Qazi',
    reporterPhone: '+92 321 4443322',
    reporterEmail: 'f.qazi@campus.edu',
    reporterDepartment: 'Physics & Applied Sciences',
    upvotes: 27,
    upvotedBy: ['user-student-1', 'user-student-2'],
    assignedTeam: 'Emergency Plumbing Riser Team',
    assignedTech: 'M. Rafiq (Master Plumber)',
    estimatedCompletion: 'Today, 2:30 PM',
    comments: [
      {
        id: 'c-3',
        userId: 'user-admin-1',
        userAlias: 'Estate Admin Official',
        userRole: 'admin',
        text: 'Caution hazard cone deployed. Isolation valve closed on 3rd floor riser; replacement coupling being fitted now.',
        timestamp: '9:15 AM',
        isOfficialAdminUpdate: true
      }
    ]
  },
  {
    id: 'issue-103',
    title: 'Broken fold-down auditorium seat and loose metal frame',
    category: 'furniture_fixtures',
    building: 'AB-2',
    room: 'Auditorium Hall B - Row 4, Seat 12',
    floor: 'Ground Floor',
    landmark: 'Left aisle, near exit door 2',
    description: 'Seat bracket has completely snapped off the underfloor anchoring bolts. The wooden armrest is wobbling with exposed metal screws.',
    imageUrl: brokenChairImg,
    status: 'under_review',
    priority: 'medium',
    reportedAt: 'Yesterday, 4:10 PM',
    reporterId: 'user-student-2',
    reporterAlias: 'Student #108 · Engineering',
    reporterName: 'Ayesha Malik',
    reporterPhone: '+92 312 9876543',
    reporterEmail: 'ayesha.m@campus.edu',
    reporterDepartment: 'Electrical Engineering',
    upvotes: 9,
    upvotedBy: ['user-student-1'],
    assignedTeam: 'Campus Carpentry & Furniture Maintenance',
    comments: [
      {
        id: 'c-4',
        userId: 'user-student-1',
        userAlias: 'Student #492 · CS Dept',
        userRole: 'student',
        text: 'Be careful during tomorrow general assembly in Hall B, that whole row is crowded.',
        timestamp: 'Yesterday, 5:00 PM'
      }
    ]
  }
];

export const SAMPLE_DAMAGE_PRESETS = [
  {
    title: 'Damaged wall plaster & paint in Room 205',
    category: 'wall_masonry' as const,
    building: 'AB-1' as const,
    room: 'Room no. 205 - AB-1',
    floor: '2nd Floor',
    landmark: 'Behind lecture podium',
    description: 'Chipped plaster and crack expanding along classroom wall after vibration from construction.',
    imageUrl: wallCrackImg,
    priority: 'high' as const
  },
  {
    title: 'Ceiling tile water seepage & pipe leak',
    category: 'plumbing_leak' as const,
    building: 'Science & Tech Block' as const,
    room: 'Corridor near Chem Lab 304',
    floor: '3rd Floor',
    landmark: 'Above fire extinguisher box',
    description: 'Water drops leaking from HVAC condensation pipe through acoustic tiles, making floor slippery.',
    imageUrl: ceilingPipeImg,
    priority: 'critical' as const
  },
  {
    title: 'Snapped auditorium seat bracket',
    category: 'furniture_fixtures' as const,
    building: 'AB-2' as const,
    room: 'Auditorium Hall B - Row 4, Seat 12',
    floor: 'Ground Floor',
    landmark: 'Left row corner',
    description: 'Loose hinges and sharp screws on broken classroom seat.',
    imageUrl: brokenChairImg,
    priority: 'medium' as const
  }
];
