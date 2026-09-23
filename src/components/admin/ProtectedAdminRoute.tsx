import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboard } from './AdminDashboard';

export const ProtectedAdminRoute: React.FC = () => {
  const { isAdminAuthenticated, adminAuthLoading } = useStore();

  if (adminAuthLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-700">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-800">Verifying Administrator Authorization...</p>
        <p className="text-xs text-slate-500 mt-1">Checking secure session token with ZStore server</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  return <AdminDashboard />;
};
