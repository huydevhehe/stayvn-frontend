import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "@/components/UserSidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">      
      <main className="flex-1 section-padding py-8 lg:py-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <UserSidebar />
          </aside>

          {/* Page Content */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
