import { Link, useLocation } from "react-router";
import { Terminal } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO */}
          <Link
            to="/"
            className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
             <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-8 h-8 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                  <Terminal className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <span className="font-bold text-sm text-zinc-100 tracking-wider">
              EVALO
            </span>
          </Link>

          {/* NAVIGATION ITEMS */}
          <div className="flex items-center gap-6">
            
            <Link
              to="/problems"
              className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300
                ${
                  isActive("/problems")
                    ? "text-white"
                    : "text-zinc-500 hover:text-white"
                }
              `}
            >
              Problems
            </Link>

            <Link
              to="/dashboard"
              className={`text-xs font-medium uppercase tracking-widest transition-colors duration-300
                ${
                  isActive("/dashboard")
                    ? "text-white"
                    : "text-zinc-500 hover:text-white"
                }
              `}
            >
              Dashboard
            </Link>

            <div className="h-4 w-px bg-white/10" />

            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
