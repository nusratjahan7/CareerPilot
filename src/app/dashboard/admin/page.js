"use client";

export default function DashboardAdminPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome Admin!</h2>
        <p className="text-gray-600 dark:text-gray-300">
          This is your admin dashboard. From here you can manage users,
          moderate content, and view system statistics.
        </p>
      </div>
    </div>
  );
}
