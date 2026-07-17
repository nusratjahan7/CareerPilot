"use client";

export default function UserProfilePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">User Profile Information</h2>
        <p className="text-gray-600 dark:text-gray-300">
          View and update your personal profile information here.
        </p>
      </div>
    </div>
  );
}
