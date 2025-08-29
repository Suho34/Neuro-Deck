"use client";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Calendar, Settings, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left side - Logo/Brand and Greeting */}
          <div className="flex items-center space-x-6">
            {/* Logo/Brand */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image
                src="/logo.svg" // 👈 stored in /public/logo.svg
                alt="NeuroDeck Logo"
                width={70} // tweak size
                height={70}
                priority // optimizes for first load (since it’s in navbar)
              />
            </Link>

            {/* Greeting - Hidden on mobile */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-800">
                {getGreeting()}, {session?.user?.name?.split(" ")[0] || "User"}!
                👋
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(currentTime)}
              </p>
            </div>
          </div>

          {/* Right side - Time and Actions */}
          <div className="flex items-center gap-4">
            {/* Current Time */}
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Current Time</p>
              <p className="text-lg font-semibold text-gray-800">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {/* Mobile Greeting */}
            <div className="mb-4 lg:hidden">
              <h2 className="text-lg font-semibold text-gray-800">
                {getGreeting()}, {session?.user?.name?.split(" ")[0] || "User"}!
                👋
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" />
                {formatDate(currentTime)}
              </p>
            </div>

            {/* Mobile Time (if hidden on desktop) */}
            <div className="sm:hidden mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Current Time:</span>
                <span className="text-sm font-medium text-gray-800">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex flex-col space-y-2">
              <button className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Settings</span>
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-red-600">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
