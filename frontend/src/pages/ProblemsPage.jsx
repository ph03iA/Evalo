import { useState } from 'react';
import { Link } from "react-router";
import { Terminal, Search, ArrowUpRight, Filter } from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { getDifficultyColor } from "../lib/utils";
import Navbar from "../components/Navbar";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);
  const [hoveredId, setHoveredId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#030303]">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }}></div>
      
      {/* Ambient Glow */}
      <div className="fixed top-0 right-0 w-[800px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-900/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto pt-8 pb-24 px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-400">Live Assessment</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold text-white tracking-tighter leading-tight">
              Algorithm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-zinc-500">Mastery.</span>
            </h1>
            
            <p className="text-zinc-400 text-lg font-light leading-relaxed border-l-2 border-emerald-500/30 pl-6">
              A collection of high-frequency interview problems designed to test your limits and refine your problem-solving intuition.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
             <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-xl backdrop-blur-sm hover:bg-zinc-900/60 transition-colors group">
                <div className="text-3xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{problems.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Total Problems</div>
             </div>
             <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-xl backdrop-blur-sm hover:bg-zinc-900/60 transition-colors group">
                <div className="text-3xl font-bold text-emerald-500 mb-1">{easyProblemsCount}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Easy</div>
             </div>
             <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-xl backdrop-blur-sm hover:bg-zinc-900/60 transition-colors group">
                <div className="text-3xl font-bold text-orange-400 mb-1">{mediumProblemsCount}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Medium</div>
             </div>
             <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-xl backdrop-blur-sm hover:bg-zinc-900/60 transition-colors group">
                <div className="text-3xl font-bold text-rose-500 mb-1">{hardProblemsCount}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Hard</div>
             </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="sticky top-20 z-30 mb-6 -mx-2 px-2">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 flex flex-col md:flex-row items-center gap-4 shadow-2xl shadow-black/50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title or topic..." 
                      className="w-full bg-transparent border-none outline-none pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 font-medium"
                    />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto px-2 pb-2 md:pb-0">
                    <button className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/5 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer">
                        <Filter className="w-3 h-3" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Problem List */}
        <div className="grid gap-3">
            {filteredProblems.map((problem) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                onMouseEnter={() => setHoveredId(problem.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-2xl bg-[#080808] border border-white/5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_30px_-15px_rgba(16,185,129,0.15)] hover:bg-[#0a0a0a]"
              >
                {/* Status Indicator */}
                <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all duration-300 ${hoveredId === problem.id ? 'bg-emerald-500 opacity-100' : 'bg-zinc-800 opacity-50'}`} />

                {/* Content Container */}
                <div className="flex items-start gap-5 flex-1 pl-4">
                    {/* Icon Box */}
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-950/20 group-hover:border-emerald-500/20 transition-all duration-500">
                        <Terminal className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors tracking-tight">
                                {problem.title}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${getDifficultyColor(problem.difficulty)}`}>
                                {problem.difficulty}
                            </span>
                        </div>
                        <p className="text-sm text-zinc-300 line-clamp-1 group-hover:text-zinc-200 transition-colors">
                            {problem.description?.text || 'No description available.'}
                        </p>
                        <div className="flex items-center gap-4 pt-1">
                            <span className="text-sm text-zinc-300 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {problem.category || 'General'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Area */}
                <div className="pl-4 md:pl-0 flex items-center justify-end md:w-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${hoveredId === problem.id ? 'bg-emerald-500 border-emerald-500 text-white rotate-0 shadow-lg shadow-emerald-500/20' : 'bg-transparent border-white/10 text-zinc-600 -rotate-45'}`}>
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
              </Link>
            ))}
        </div>

      </div>
    </div>
  );
}

export default ProblemsPage;
