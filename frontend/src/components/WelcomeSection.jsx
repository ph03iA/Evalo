import { useUser } from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#080808] p-1">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative rounded-[22px] px-8 py-10 md:px-10 md:py-12 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 relative z-10">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-white">
              Welcome back, <span className="text-zinc-500">{user?.firstName || "Developer"}</span>
            </h1>
            <p className="text-base text-zinc-500 font-light max-w-xl leading-relaxed">
              Your command center for technical interviews.
            </p>
          </div>
          
          <button
            onClick={onCreateSession}
            className="group relative px-6 py-3 bg-white text-black rounded-lg transition-all duration-300 hover:bg-zinc-200 hover:-translate-y-0.5 shadow-xl shadow-white/5 cursor-pointer"
          >
            <div className="flex items-center gap-3 font-semibold tracking-tight text-sm">
              <span>Create Session</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;