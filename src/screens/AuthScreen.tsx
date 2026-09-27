import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, GraduationCap, Shield, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginStudent, registerStudent, loginAdmin, error, clearError, isLoading } = useAuth();

  // Mode: 'student' | 'admin'
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  // Student mode: 'login' | 'register'
  const [studentMode, setStudentMode] = useState<'login' | 'register'>('login');

  // Student Form State
  const [studentEmail, setStudentEmail] = useState('');
  const [studentRegNo, setStudentRegNo] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTabSwitch = (tab: 'student' | 'admin') => {
    setActiveTab(tab);
    setFormError(null);
    clearError();
    setSuccessMessage(null);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (studentMode === 'login') {
      try {
        await loginStudent({
          universityEmail: studentEmail,
          registrationNumber: studentRegNo,
          password: studentPassword
        });
      } catch (err: any) {
        setFormError(err?.message || 'Login failed.');
      }
    } else {
      // Register
      try {
        await registerStudent({
          universityEmail: studentEmail,
          registrationNumber: studentRegNo,
          password: studentPassword
        });
        setSuccessMessage('Student account created successfully! You are now logged in.');
      } catch (err: any) {
        setFormError(err?.message || 'Registration failed.');
      }
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    try {
      await loginAdmin({
        adminEmail,
        password: adminPassword
      });
    } catch (err: any) {
      setFormError(err?.message || 'Admin login failed.');
    }
  };

  const fillStudentDemo = () => {
    setStudentMode('login');
    setStudentEmail('student@uni.edu');
    setStudentRegNo('CS-2024-884');
    setStudentPassword('password123');
    setFormError(null);
  };

  const fillAdminDemo = () => {
    setAdminEmail('admin@campus.edu');
    setAdminPassword('admin123');
    setFormError(null);
  };

  const displayedError = formError || error;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-500/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            UniFix Campus Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            University Infrastructure & Damage Management
          </p>
        </div>

        {/* 1. First Screen: ONLY Student Login | Admin Login */}
        <div className="p-6">
          {/* Main Segmented Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch('student')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('admin')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>

          {/* Feedback messages */}
          {displayedError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{displayedError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: STUDENT AUTHENTICATION FLOW */}
          {activeTab === 'student' && (
            <div>
              {/* Prominent Login vs Create Account Segmented Selector */}
              <div className="grid grid-cols-2 p-1 bg-indigo-50/70 border border-indigo-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('login');
                    setFormError(null);
                    clearError();
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    studentMode === 'login'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-indigo-600/80 hover:text-indigo-900'
                  }`}
                >
                  Student Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStudentMode('register');
                    setFormError(null);
                    clearError();
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    studentMode === 'register'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-indigo-600/80 hover:text-indigo-900'
                  }`}
                >
                  Create Student Account
                </button>
              </div>

              <div className="border-b border-slate-100 pb-2 mb-3.5">
                <h3 className="text-xs font-bold text-slate-800">
                  {studentMode === 'login' ? 'Sign In to Your Student Account' : 'New Student Registration'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {studentMode === 'login'
                    ? 'Enter your university credentials to access the Student Portal'
                    : 'Create your account with your university email and registration number'}
                </p>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    University Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., student@uni.edu"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., CS-2024-884"
                    value={studentRegNo}
                    onChange={(e) => setStudentRegNo(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {studentMode === 'login' ? 'Password' : 'Create New Password'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder={studentMode === 'login' ? 'Enter password' : 'Create password (min 6 characters)'}
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{studentMode === 'login' ? 'Sign In to Student Portal' : 'Create Student Account & Sign In'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle switch between login & register at bottom */}
              <div className="mt-4 text-center">
                {studentMode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('register');
                      setFormError(null);
                      clearError();
                    }}
                    className="text-xs text-slate-600 hover:text-indigo-700 cursor-pointer"
                  >
                    Don't have an account yet? <strong className="text-indigo-600 underline">Create Student Account</strong>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('login');
                      setFormError(null);
                      clearError();
                    }}
                    className="text-xs text-slate-600 hover:text-indigo-700 cursor-pointer"
                  >
                    Already have a student account? <strong className="text-indigo-600 underline">Log in here</strong>
                  </button>
                )}
              </div>

              {/* Demo Helper */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Need demo student credentials?</span>
                <button
                  type="button"
                  onClick={fillStudentDemo}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer underline"
                >
                  Auto-fill Demo Student
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN AUTHENTICATION FLOW */}
          {activeTab === 'admin' && (
            <div>
              <div className="border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-bold text-slate-800">
                  Estate & Staff Administrator Sign In
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Direct access to University Work Orders & Student Reports
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., admin@campus.edu"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Sign In to Admin Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Helper */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Need mock admin credentials?</span>
                <button
                  type="button"
                  onClick={fillAdminDemo}
                  className="font-semibold text-slate-700 hover:text-slate-900 cursor-pointer underline"
                >
                  Auto-fill Demo Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
