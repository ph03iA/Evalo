import { Users, Loader, Calendar } from "lucide-react";
import { getDifficultyColor } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="bg-[#080808] border border-white/5 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <h2 className="text-xl font-medium text-white tracking-tight">Session History</h2>
        <button className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer">View All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader className="w-6 h-6 animate-spin text-zinc-700" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className="group relative p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${getDifficultyColor(session.difficulty)}`}>
                  {session.difficulty}
                </div>
                {session.status === "active" && (
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                )}
              </div>

              <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors mb-4">{session.problem}</h3>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
                  <Users className="w-3.5 h-3.5" />
                  <span>{session.participant ? "2" : "1"}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-zinc-500 text-sm">No past sessions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentSessions;