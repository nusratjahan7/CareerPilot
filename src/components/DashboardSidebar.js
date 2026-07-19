"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Plus,
  Briefcase,
  MessageSquare,
  User,
  Menu,
  X,
  Dock,
  Bookmark
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Add Career', icon: Plus, path: '/dashboard/add' },
    { name: 'Manage Careers', icon: Briefcase, path: '/dashboard/manage' },

    { name: 'AI Chat', icon: MessageSquare, path: '/dashboard/ai-chat' },
    { name: 'Profile', icon: User, path: '/dashboard/profile' },
    { name: 'My Applications', icon: Dock, path: '/dashboard/applications' },
    { name: 'Saved', icon: Bookmark, path: '/dashboard/saved' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- MOBILE TOP HEADER (Hidden on Desktop) --- */}
      <div className="md:hidden w-full h-16 bg-[#0e0e10]/90 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-6 sticky top-0 z-40">
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/[0.02] border border-white/[0.05]"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <span className="text-white font-medium text-sm">{user?.name}</span>
        </div>
      </div>

      {/* --- MOBILE BACKDROP --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* --- SIDEBAR PANEL --- */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:z-0 w-72 min-h-screen bg-gradient-to-b from-[#0e0e10] to-[#050506] text-gray-400 flex flex-col p-6 font-sans border-r border-white/[0.06] transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Decorative Background Glows */}
        <div className="absolute top-[-20%] left-[-20%] w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-72 h-72 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Profile Card & Close Action Wrapper */}
        <div className="flex items-center justify-between gap-2 relative z-10 shrink-0">
          <Link
            href="/dashboard/profile"
            className="flex-1 flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md hover:bg-white/[0.04] transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <User className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0e0e10] rounded-full" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-medium text-sm tracking-wide truncate">
                {user?.name}
              </h2>
            </div>
          </Link>

          {/* Close button inside mobile menu */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2.5 text-gray-400 hover:text-white rounded-xl bg-white/[0.02] border border-white/[0.05]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-6 shrink-0 relative z-10" />

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 relative z-10">
          {menuItems.map((item) => {
            const Icon = item.icon;


            const isActive = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-l-2 ${isActive
                  ? 'text-white bg-gradient-to-r from-white/[0.04] to-transparent border-blue-500 pl-3.5 shadow-sm'
                  : 'hover:text-gray-200 hover:bg-white/[0.02] border-transparent'
                  }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                />
                <span className="flex-1 truncate">{item.name}</span>

                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;