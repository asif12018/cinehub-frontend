import { Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "@/service/auth.service";


export function Navbar() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUserInfo,
  });
  console.log('this is user from navbar', user);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent"
        >
          CineHub
        </Link>

        {/* Search - hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              className="w-full pl-12 pr-4 py-2 bg-black/50 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Profile - mobile hamburger, desktop avatar */}
        <div className="flex items-center space-x-4">
          <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
            <Search className="w-6 h-6 text-white" />
          </button>
          {
            user?.role === "USER" && <div>
            <Link href="/media">Media</Link>
          </div>
          }
          {
            (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && <div>
            <Link href="/dashboard">Dashboard</Link>
          </div>
          }
          <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center hover:from-red-600 hover:to-red-500 transition-all duration-300 cursor-pointer">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
}
