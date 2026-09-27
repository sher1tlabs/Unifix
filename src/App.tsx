import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import { AuthScreen } from './screens/AuthScreen';
import { StudentPortal } from './screens/StudentPortal';
import { AdminPortal } from './screens/AdminPortal';

const AppNavigator: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Loading UniFix Portal...</span>
        </div>
      </div>
    );
  }

  // 1. First Screen: If not logged in, show ONLY Student Login | Admin Login
  if (!currentUser) {
    return <AuthScreen />;
  }

  // 3. Student Portal (Completely separated from Admin)
  if (currentUser.role === 'student') {
    return <StudentPortal />;
  }

  // 8. Admin Portal (Completely separated from Student)
  if (currentUser.role === 'admin') {
    return <AdminPortal />;
  }

  return <AuthScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <AppNavigator />
      </PostProvider>
    </AuthProvider>
  );
}
