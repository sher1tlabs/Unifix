import { DamageCategory, IssuePriority, IssueStatus, IssueReport, User } from '../types';

export const CATEGORY_META: Record<DamageCategory, { label: string; icon: string; bg: string; color: string }> = {
  wall_masonry: {
    label: 'Wall & Masonry',
    icon: 'Hammer',
    bg: 'bg-amber-50',
    color: 'text-amber-700'
  },
  plumbing_leak: {
    label: 'Plumbing & Leak',
    icon: 'Droplets',
    bg: 'bg-sky-50',
    color: 'text-sky-700'
  },
  electrical: {
    label: 'Electrical & Power',
    icon: 'Zap',
    bg: 'bg-yellow-50',
    color: 'text-yellow-700'
  },
  furniture_fixtures: {
    label: 'Furniture & Desks',
    icon: 'Armchair',
    bg: 'bg-orange-50',
    color: 'text-orange-700'
  },
  hvac_ac: {
    label: 'AC & Ventilation',
    icon: 'Wind',
    bg: 'bg-cyan-50',
    color: 'text-cyan-700'
  },
  doors_windows: {
    label: 'Doors & Windows',
    icon: 'DoorOpen',
    bg: 'bg-emerald-50',
    color: 'text-emerald-700'
  },
  cleanliness_hazard: {
    label: 'Cleanliness / Hazard',
    icon: 'AlertTriangle',
    bg: 'bg-rose-50',
    color: 'text-rose-700'
  },
  other: {
    label: 'General Facility',
    icon: 'Wrench',
    bg: 'bg-slate-50',
    color: 'text-slate-700'
  }
};

export const STATUS_META: Record<IssueStatus, { label: string; bg: string; text: string; dot: string }> = {
  reported: {
    label: 'Reported',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    dot: 'bg-slate-400'
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    dot: 'bg-amber-500'
  },
  assigned: {
    label: 'Crew Assigned',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-500'
  },
  in_progress: {
    label: 'Repairing Now',
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    dot: 'bg-indigo-500'
  },
  resolved: {
    label: 'Fixed & Verified',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500'
  },
  rejected: {
    label: 'Closed / Duplicate',
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    dot: 'bg-rose-400'
  }
};

export const PRIORITY_META: Record<IssuePriority, { label: string; text: string; bg: string }> = {
  low: { label: 'Low Priority', text: 'text-slate-600', bg: 'bg-slate-100' },
  medium: { label: 'Medium', text: 'text-blue-700', bg: 'bg-blue-50' },
  high: { label: 'High Attention', text: 'text-amber-700', bg: 'bg-amber-50' },
  critical: { label: 'Hazard / Critical', text: 'text-red-700', bg: 'bg-red-50' }
};

/**
 * Enforces user privacy according to the brief:
 * "users mustn't be able to see other users in here... Like not seeing their Phone no.s, and other things etc."
 * Only Estate Admins have clearance to view reporter phone and full name.
 */
export const getReporterPrivacyDetails = (issue: IssueReport, viewer: User) => {
  const isAdmin = viewer.role === 'admin';
  const isSelf = viewer.id === issue.reporterId;

  if (isAdmin) {
    return {
      canViewContact: true,
      displayName: issue.reporterName,
      phone: issue.reporterPhone,
      email: issue.reporterEmail,
      department: issue.reporterDepartment,
      aliasBadge: `${issue.reporterAlias} (Verified ID)`,
      privacyNotice: 'Admin Clearance: Reporter contact is visible for maintenance dispatch only.'
    };
  }

  if (isSelf) {
    return {
      canViewContact: true,
      displayName: 'You (Anonymous to peers)',
      phone: issue.reporterPhone,
      email: issue.reporterEmail,
      department: issue.reporterDepartment,
      aliasBadge: issue.reporterAlias,
      privacyNotice: 'Your contact details are protected and only visible to Campus Estate Admins.'
    };
  }

  // Peer view (Student, Faculty, Staff)
  return {
    canViewContact: false,
    displayName: issue.reporterAlias,
    phone: '•••• •••••••',
    email: '•••••••••••@campus.edu',
    department: 'Campus Member',
    aliasBadge: 'Anonymous Reporter',
    privacyNotice: '🔒 Privacy Shield Active: Phone numbers and personal IDs are shielded from students.'
  };
};

/**
 * Compresses an uploaded image file on the client using an offscreen canvas
 * to prevent massive memory usage and ensure snappy rendering.
 */
export const compressImageFile = (file: File, maxWidth = 1280, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};
