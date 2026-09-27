import React, { createContext, useContext, useState, useEffect } from 'react';
import { IssueReport, MaintenanceNotice, User, UserRole, IssueStatus, IssuePriority, DamageCategory, BuildingBlock } from '../types';
import { INITIAL_ISSUES, INITIAL_NOTICES, PRESET_USERS } from '../data/initialData';

interface AppContextType {
  currentUser: User;
  users: User[];
  issues: IssueReport[];
  notices: MaintenanceNotice[];
  activeTab: 'feed' | 'report' | 'my_reports' | 'admin' | 'notices' | 'analytics';
  setActiveTab: (tab: 'feed' | 'report' | 'my_reports' | 'admin' | 'notices' | 'analytics') => void;
  selectedIssue: IssueReport | null;
  setSelectedIssue: (issue: IssueReport | null) => void;
  filterBuilding: string;
  setFilterBuilding: (b: string) => void;
  filterCategory: string;
  setFilterCategory: (c: string) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  deviceMode: 'mobile' | 'responsive';
  setDeviceMode: (mode: 'mobile' | 'responsive') => void;
  showPrivacyModal: boolean;
  setShowPrivacyModal: (show: boolean) => void;
  showUserSwitcherModal: boolean;
  setShowUserSwitcherModal: (show: boolean) => void;

  // Actions
  switchUser: (userId: string) => void;
  addIssueReport: (data: {
    title: string;
    category: DamageCategory;
    building: BuildingBlock;
    room: string;
    floor: string;
    landmark?: string;
    description: string;
    imageUrl: string;
    priority: IssuePriority;
  }) => IssueReport;
  updateIssueStatus: (
    issueId: string, 
    status: IssueStatus, 
    resolution?: { notes?: string; imageUrl?: string }
  ) => void;
  assignIssueTeam: (
    issueId: string, 
    team: string, 
    tech: string, 
    estimatedCompletion: string
  ) => void;
  updateIssuePriority: (issueId: string, priority: IssuePriority) => void;
  toggleUpvote: (issueId: string) => void;
  addComment: (issueId: string, text: string, isOfficial?: boolean) => void;
  deleteIssue: (issueId: string) => void;
  addNotice: (data: { title: string; content: string; building: string; urgency: 'info' | 'warning' | 'urgent' }) => void;
  deleteNotice: (noticeId: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_ISSUES = 'unifix_campus_issues_v1';
const STORAGE_KEY_NOTICES = 'unifix_campus_notices_v1';
const STORAGE_KEY_USER = 'unifix_current_user_id_v1';
const STORAGE_KEY_MODE = 'unifix_device_mode_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(PRESET_USERS);
  
  // Current user
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_USER) || PRESET_USERS[0].id;
  });

  const currentUser = users.find(u => u.id === currentUserId) || PRESET_USERS[0];

  // Issues list
  const [issues, setIssues] = useState<IssueReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ISSUES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored issues:', e);
      }
    }
    return INITIAL_ISSUES;
  });

  // Notices
  const [notices, setNotices] = useState<MaintenanceNotice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTICES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored notices:', e);
      }
    }
    return INITIAL_NOTICES;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'feed' | 'report' | 'my_reports' | 'admin' | 'notices' | 'analytics'>('feed');
  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
  const [filterBuilding, setFilterBuilding] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showUserSwitcherModal, setShowUserSwitcherModal] = useState<boolean>(false);

  const [deviceMode, setDeviceMode] = useState<'mobile' | 'responsive'>(() => {
    return (localStorage.getItem(STORAGE_KEY_MODE) as 'mobile' | 'responsive') || 'mobile';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODE, deviceMode);
  }, [deviceMode]);

  // Keep selectedIssue fresh if issues list changes
  useEffect(() => {
    if (selectedIssue) {
      const updated = issues.find(i => i.id === selectedIssue.id);
      if (updated) setSelectedIssue(updated);
    }
  }, [issues]);

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      // If switching to admin, can automatically route to admin or stay on current tab
      if (target.role === 'admin' && activeTab === 'report') {
        setActiveTab('admin');
      }
    }
  };

  const addIssueReport = (data: {
    title: string;
    category: DamageCategory;
    building: BuildingBlock;
    room: string;
    floor: string;
    landmark?: string;
    description: string;
    imageUrl: string;
    priority: IssuePriority;
  }): IssueReport => {
    const newIssue: IssueReport = {
      id: `issue-${Date.now()}`,
      title: data.title,
      category: data.category,
      building: data.building,
      room: data.room,
      floor: data.floor,
      landmark: data.landmark,
      description: data.description,
      imageUrl: data.imageUrl,
      status: 'reported',
      priority: data.priority,
      reportedAt: 'Just now',
      reporterId: currentUser.id,
      reporterAlias: currentUser.anonymizedAlias,
      // PII only accessible to Admin:
      reporterName: currentUser.name,
      reporterPhone: currentUser.phone,
      reporterEmail: currentUser.email,
      reporterDepartment: currentUser.department,
      upvotes: 1,
      upvotedBy: [currentUser.id],
      comments: [
        {
          id: `comment-auto-${Date.now()}`,
          userId: 'system',
          userAlias: 'Campus Works Automation',
          userRole: 'staff',
          text: `Ticket successfully logged for ${data.room}. Estate Works triage team has received the alert.`,
          timestamp: 'Just now',
          isOfficialAdminUpdate: true
        }
      ]
    };

    setIssues(prev => [newIssue, ...prev]);
    return newIssue;
  };

  const updateIssueStatus = (
    issueId: string, 
    status: IssueStatus, 
    resolution?: { notes?: string; imageUrl?: string }
  ) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;

      const statusLabels: Record<IssueStatus, string> = {
        reported: 'Reported to Estate Office',
        under_review: 'Under Review by Maintenance Engineer',
        assigned: 'Work Order Assigned to Crew',
        in_progress: 'Maintenance Crew On-Site Repairing',
        resolved: 'Marked as Fully Resolved & Fixed',
        rejected: 'Declined / Duplicate Ticket'
      };

      const adminComment = {
        id: `comment-${Date.now()}`,
        userId: currentUser.id,
        userAlias: currentUser.anonymizedAlias,
        userRole: currentUser.role,
        text: `Status updated to [${statusLabels[status]}].${resolution?.notes ? ` Note: "${resolution.notes}"` : ''}`,
        timestamp: 'Just now',
        isOfficialAdminUpdate: true
      };

      return {
        ...issue,
        status,
        resolutionNotes: resolution?.notes ?? issue.resolutionNotes,
        resolutionImageUrl: resolution?.imageUrl ?? issue.resolutionImageUrl,
        resolvedAt: status === 'resolved' ? 'Today' : issue.resolvedAt,
        comments: [...issue.comments, adminComment]
      };
    }));
  };

  const assignIssueTeam = (
    issueId: string, 
    team: string, 
    tech: string, 
    estimatedCompletion: string
  ) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      
      const adminComment = {
        id: `comment-assign-${Date.now()}`,
        userId: currentUser.id,
        userAlias: currentUser.anonymizedAlias,
        userRole: currentUser.role,
        text: `Assigned to ${team} (${tech}). Estimated completion: ${estimatedCompletion}.`,
        timestamp: 'Just now',
        isOfficialAdminUpdate: true
      };

      return {
        ...issue,
        status: 'assigned',
        assignedTeam: team,
        assignedTech: tech,
        estimatedCompletion,
        comments: [...issue.comments, adminComment]
      };
    }));
  };

  const updateIssuePriority = (issueId: string, priority: IssuePriority) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      return { ...issue, priority };
    }));
  };

  const toggleUpvote = (issueId: string) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      const hasUpvoted = issue.upvotedBy.includes(currentUser.id);
      return {
        ...issue,
        upvotes: hasUpvoted ? Math.max(0, issue.upvotes - 1) : issue.upvotes + 1,
        upvotedBy: hasUpvoted 
          ? issue.upvotedBy.filter(id => id !== currentUser.id)
          : [...issue.upvotedBy, currentUser.id]
      };
    }));
  };

  const addComment = (issueId: string, text: string, isOfficial = false) => {
    if (!text.trim()) return;
    setIssues(prev => prev.map(issue => {
      if (issue.id !== issueId) return issue;
      const newComment = {
        id: `comment-${Date.now()}`,
        userId: currentUser.id,
        userAlias: currentUser.role === 'admin' ? 'Estate Admin Official' : currentUser.anonymizedAlias,
        userRole: currentUser.role,
        text: text.trim(),
        timestamp: 'Just now',
        isOfficialAdminUpdate: isOfficial || currentUser.role === 'admin'
      };
      return {
        ...issue,
        comments: [...issue.comments, newComment]
      };
    }));
  };

  const deleteIssue = (issueId: string) => {
    setIssues(prev => prev.filter(i => i.id !== issueId));
    if (selectedIssue?.id === issueId) {
      setSelectedIssue(null);
    }
  };

  const addNotice = (data: { title: string; content: string; building: string; urgency: 'info' | 'warning' | 'urgent' }) => {
    const newNotice: MaintenanceNotice = {
      id: `notice-${Date.now()}`,
      title: data.title,
      content: data.content,
      building: data.building,
      urgency: data.urgency,
      date: 'Just now',
      author: currentUser.name
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const deleteNotice = (noticeId: string) => {
    setNotices(prev => prev.filter(n => n.id !== noticeId));
  };

  const resetDemoData = () => {
    setIssues(INITIAL_ISSUES);
    setNotices(INITIAL_NOTICES);
    localStorage.removeItem(STORAGE_KEY_ISSUES);
    localStorage.removeItem(STORAGE_KEY_NOTICES);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      issues,
      notices,
      activeTab,
      setActiveTab,
      selectedIssue,
      setSelectedIssue,
      filterBuilding,
      setFilterBuilding,
      filterCategory,
      setFilterCategory,
      filterStatus,
      setFilterStatus,
      searchQuery,
      setSearchQuery,
      deviceMode,
      setDeviceMode,
      showPrivacyModal,
      setShowPrivacyModal,
      showUserSwitcherModal,
      setShowUserSwitcherModal,
      switchUser,
      addIssueReport,
      updateIssueStatus,
      assignIssueTeam,
      updateIssuePriority,
      toggleUpvote,
      addComment,
      deleteIssue,
      addNotice,
      deleteNotice,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
