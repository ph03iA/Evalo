import { getDifficultyColor } from "../lib/utils";
import { List } from 'lucide-react';

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-zinc-400 relative rounded-xl overflow-hidden border border-zinc-800">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                </div>
                <span className="text-zinc-500 text-xs font-medium flex items-center gap-1.5 uppercase tracking-wider">
                     {problem.category}
                </span>
            </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">{problem.title}</h1>
        
        {/* Selector */}
        <div className="mt-4 relative group">
            <select
                className="w-full bg-[#030303] border border-white/5 text-sm text-zinc-300 rounded-lg p-2.5 pl-3 pr-10 outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer hover:bg-white/5 hover:border-white/10"
                value={currentProblemId}
                onChange={(e) => onProblemChange(e.target.value)}
            >
                {allProblems.map((p, index) => (
                <option key={p.id} value={p.id} className="bg-[#0a0a0a]">
                    {index + 1}. {p.title}
                </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <List className="w-4 h-4" />
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Description Text */}
        <div>
            <div className="text-white font-semibold mb-3 text-lg">
                Description
            </div>
            <p className="text-zinc-400 leading-relaxed text-sm">{problem.description?.text}</p>
            {problem.description?.notes?.length > 0 && (
                <div className="mt-4 space-y-2">
                    {problem.description.notes.map((note, idx) => (
                        <div key={idx} className="flex gap-2 text-zinc-400 text-sm">
                            <span className="text-emerald-500 mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-emerald-500" />
                            <span>{note}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Examples */}
        <div>
            <div className="text-white font-semibold mb-4 text-lg">
                Examples
            </div>
            <div className="space-y-4">
                {problem.examples?.map((example, index) => (
                    <div key={index} className="rounded-xl border border-white/5 bg-[#030303]/50 overflow-hidden group hover:border-white/10 transition-colors">
                         <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Example {index + 1}</span>
                         </div>
                         <div className="p-4 space-y-3 font-mono text-sm">
                            <div className="grid grid-cols-[60px_1fr] gap-2">
                                <span className="text-zinc-500 select-none">Input:</span>
                                <span className="text-zinc-200">{example.input}</span>
                            </div>
                            <div className="grid grid-cols-[60px_1fr] gap-2">
                                <span className="text-zinc-500 select-none">Output:</span>
                                <span className="text-emerald-400">{example.output}</span>
                            </div>
                            {example.explanation && (
                                <div className="grid grid-cols-[60px_1fr] gap-2 pt-2 mt-2 border-t border-dashed border-white/5">
                                    <span className="text-zinc-500 select-none">Note:</span>
                                    <span className="text-zinc-400 font-sans">{example.explanation}</span>
                                </div>
                            )}
                         </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Constraints */}
        <div>
            <div className="text-white font-semibold mb-3 text-lg">
                Constraints
            </div>
            <ul className="space-y-2">
                {problem.constraints?.map((constraint, idx) => (
                    <li key={idx} className="flex gap-3 text-sm font-mono text-zinc-400 bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-emerald-500 select-none">•</span>
                        {constraint}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
