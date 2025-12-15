function StatsCards({ activeSessionsCount, recentSessionsCount }) {
    return (
      <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 h-full content-start">
        {/* Active Count */}
        <div className="group relative p-6 bg-[#080808] border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-all duration-500">
          <div className="relative z-10 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Active</span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live
              </div>
            </div>
            <div>
              <div className="text-5xl font-medium text-white tracking-tighter">{activeSessionsCount}</div>
              <div className="text-xs text-zinc-600 mt-2 font-medium">Sessions in progress</div>
            </div>
          </div>
        </div>
  
        {/* Total Sessions Count */}
        <div className="group relative p-6 bg-[#080808] border border-white/5 rounded-2xl hover:border-zinc-500/20 transition-all duration-500">
          <div className="relative z-10 flex flex-col justify-between h-32">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total</span>
            </div>
            <div>
              <div className="text-5xl font-medium text-zinc-200 tracking-tighter">{recentSessionsCount}</div>
              <div className="text-xs text-zinc-600 mt-2 font-medium">Lifetime sessions created</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default StatsCards;