import { useState } from "react";
import { Code2, Loader, Plus, X, ChevronDown, Check } from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { getDifficultyColor } from "../lib/utils";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl transform transition-all overflow-visible">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#0f0f0f] rounded-t-2xl">
          <h3 className="font-medium text-white text-lg">Create New Session</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2 relative">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Select Problem
            </label>

            <div className="relative">
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-zinc-900/50 border ${isDropdownOpen ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-white/10'} rounded-xl py-3.5 pl-11 pr-4 text-sm text-left flex items-center justify-between transition-all hover:bg-zinc-900 group cursor-pointer`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Code2 className={`absolute left-4 w-4 h-4 ${roomConfig.problem ? 'text-emerald-500' : 'text-zinc-500'} transition-colors`} />
                  <span className={`block truncate font-medium ${roomConfig.problem ? 'text-white' : 'text-zinc-500'}`}>
                    {roomConfig.problem || "Choose a coding problem..."}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>

              {/* Custom Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute z-20 w-full mt-2 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1.5 ring-1 ring-black/50">
                    <div className="max-h-[240px] overflow-y-auto custom-scrollbar space-y-1">
                      {problems.map((problem) => {
                        const isSelected = roomConfig.problem === problem.title;
                        return (
                          <button
                            key={problem.id}
                            type="button"
                            onClick={() => {
                              setRoomConfig({
                                difficulty: problem.difficulty,
                                problem: problem.title,
                              });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group cursor-pointer ${
                              isSelected 
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/15' 
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`w-4 h-4 flex items-center justify-center shrink-0 ${isSelected ? 'text-emerald-500' : 'text-transparent'}`}>
                                <Check className="w-3.5 h-3.5" />
                              </div>
                              <span className={`text-sm truncate ${isSelected ? 'text-white font-medium' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                {problem.title}
                              </span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider font-bold shrink-0 ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ROOM SUMMARY */}
          <div className={`transition-all duration-500 ease-out overflow-hidden ${roomConfig.problem ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 rounded-xl bg-emerald-900/5 border border-emerald-500/10 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-400">Ready to Launch</p>
                <div className="text-xs text-zinc-400 leading-relaxed flex flex-wrap gap-2 items-center">
                  <span>Selected:</span>
                  <span className="text-zinc-200 font-medium">{roomConfig.problem}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span className={`${getDifficultyColor(roomConfig.difficulty)} border bg-opacity-10 px-1.5 rounded text-[10px]`}>{roomConfig.difficulty}</span>
                </div>
                <p className="text-xs text-zinc-500 pt-1">
                  Capacity: <span className="text-zinc-300">2 Participants</span> (1-on-1 Mode)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/5 bg-[#0f0f0f] flex items-center justify-end gap-3 rounded-b-2xl">
          <button 
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer" 
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-black flex items-center gap-2 transition-all cursor-pointer ${
              !roomConfig.problem || isCreating 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]'
            }`}
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isCreating ? "Creating..." : "Create Session"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;