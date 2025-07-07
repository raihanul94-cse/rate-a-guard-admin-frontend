
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Building2, Users, Key, LogOut, Mail, UserPlus } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin/companies', label: 'Companies', icon: Building2 },
    { path: '/admin/email-change', label: 'Change Email', icon: Mail },
    { path: '/admin/password-change', label: 'Change Password', icon: Key },
    { path: '/admin/team-members', label: 'Team Members', icon: UserPlus },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b pb-5">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            RAG Admin
          </h1>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-3 border-t">
          <Link
            to="/admin/login"
            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Company Management System
            </h2>
            <div className="text-sm text-gray-500">
              Welcome, Administrator
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
