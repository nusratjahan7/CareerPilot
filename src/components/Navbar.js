"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/career", label: "Career" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout, hasRole } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getUserInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  const getUserAvatarUrl = (email) => {
    if (!email) return null;
    const seed = email.split("@")[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=random&color=fff&size=128`;
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setDropdownOpen(false);
  };

  const getDashboardLink = () => {
    if (hasRole("admin")) return "/dashboard/admin";
    return "/dashboard/user";
  };

  const getProfileLink = () => {
    if (hasRole("admin")) return "/dashboard/admin/profile";
    return "/dashboard/user/profile";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl dark:from-gray-950/95 dark:via-gray-950/90 dark:to-gray-950/95 shadow-[0_1px_0_rgba(59,130,246,0.15),0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_0_rgba(59,130,246,0.15),0_4px_20px_rgba(0,0,0,0.15)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            CareerPilot
          </Link>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {loading ? (
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-500"
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.email}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-200 dark:border-gray-700">
                    {getUserInitials(user.name || user.email)}
                  </div>
                )}
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
                  style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 z-50">
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setDropdownOpen(false)}
                    className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={getProfileLink()}
                    onClick={() => setDropdownOpen(false)}
                    className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left rounded-md px-4 py-2 text-sm font-medium transition-colors
                      text-red-600 dark:text-red-400
                      hover:bg-red-50 dark:hover:bg-red-950/30
                      hover:text-red-700 dark:hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200/50 bg-gradient-to-b from-white to-white/95 px-4 pb-4 pt-2 backdrop-blur-xl dark:border-gray-800/50 dark:from-gray-950 dark:to-gray-950/95 lg:hidden">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {label}
            </Link>
          ))}
          {loading ? (
            <div className="mt-4 h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : user ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.email}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-gray-200 dark:border-gray-700">
                    {getUserInitials(user.name || user.email)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name || user.email}
                  </p>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {user.role === 'admin' ? 'Administrator' : 'User'}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-1 border-t border-gray-200/50 pt-2 dark:border-gray-800/50">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                >
                  Dashboard
                </Link>
                <Link
                  href={getProfileLink()}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium transition-colors
                    text-red-600 dark:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-950/30
                    hover:text-red-700 dark:hover:text-red-300"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 flex flex-col gap-2 border-t border-gray-200/50 pt-3 dark:border-gray-800/50">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="block rounded-md bg-gray-900 px-3 py-2 text-center text-base font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
