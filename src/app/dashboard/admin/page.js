"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { PlusCircle, Briefcase, Users } from "lucide-react";

const quickLinks = [
  { href: "/dashboard/admin/add-career", label: "Add Career", icon: PlusCircle, color: "bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400" },
  { href: "/dashboard/admin/manage-career", label: "Manage Career", icon: Briefcase, color: "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" },
  { href: "/dashboard/admin/users", label: "User Manage", icon: Users, color: "bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400" },
];

export default function DashboardAdminPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {user?.name || "Admin"}. Manage your platform from here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickLinks.map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
          >
            <div className={`inline-flex p-3 rounded-lg ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {label}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
