import { Link } from "react-router";
import { ArrowRight, Loader, Users } from "lucide-react";
import { getDifficultyColor } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 bg-[#080808] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 relative z-10 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-2xl font-medium text-white tracking-tight">Live Sessions</h2>
          <p className="text-sm text-zinc-500 mt-1">Join a room to start collaborating.</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
          <span className="text-xs font-medium text-zinc-400">{sessions.length} active</span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1 relative z-10 custom-scrollbar pr-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader className="w-6 h-6 animate-spin text-zinc-700" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                {/* Minimal Status Dot */}
                <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors"></div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-zinc-300 group-hover:text-white transition-colors text-sm">{session.problem}</h3>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-bold ${getDifficultyColor(session.difficulty)}`}>
                      {session.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-600 group-hover:text-zinc-500">
                    <span>{session.host?.name || 'Anonymous'}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-zinc-700"></span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{session.participant ? "2/2" : "1/2"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {session.participant && !isUserInSession(session) ? (
                <span className="text-xs font-medium text-zinc-700 px-3">
                  Full
                </span>
              ) : (
                <Link
                  to={`/session/${session._id}`}
                  className="opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 transition-all text-xs font-bold tracking-tight transform translate-x-2 group-hover:translate-x-0"
                >
                  {isUserInSession(session) ? "Rejoin" : "Join"}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-500 text-sm">No active sessions at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveSessions;