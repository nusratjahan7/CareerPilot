import DashboardSidebar from '@/components/DashboardSidebar';
import React from 'react';


const Layout = ({ children }) => {
  return (
    <div className="flex w-full h-screen bg-[#0b0b0c] text-gray-100 overflow-hidden font-sans">

      {/* 1. Left Sidebar */}
      <DashboardSidebar />

      {/* 2. Main Workspace Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Optional: Top Navigation Bar / Header */}
        <header className="h-16 border-b border-[#222226] bg-[#121214] flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-white">Console</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* You can add global actions like search, theme toggles, or notifications here */}
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              System Online
            </span>
          </div>
        </header>

        {/* 3. Dynamic Page Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-[#0b0b0c] p-8">
          {/* Your page components will render right here */}
          {children || (
            <div className="border-2 border-dashed border-[#222226] rounded-2xl h-full flex items-center justify-center text-gray-500">
              Select a menu item to load view content.
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Layout;