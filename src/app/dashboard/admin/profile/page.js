"use client";

export default function AdminProfilePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Profile Information</h2>
        <p className="text-gray-600 dark:text-gray-300">
          View and update your admin profile information here.
        </p>
      </div>
    </div>
  );
}
