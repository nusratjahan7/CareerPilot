"use client";

export default function DashboardUserPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
        <p className="text-gray-600 dark:text-gray-300">
          This is your user dashboard. From here you can manage your career profile,
          view job matches, and track your application progress.
        </p>
      </div>
    </div>
  );
}
