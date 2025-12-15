import { Terminal, CheckCircle2, AlertCircle } from 'lucide-react';

function OutputPanel({ output }) {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] rounded-xl overflow-hidden border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/5">
        <div className="flex items-center gap-2 text-zinc-400">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Console Output</span>
        </div>
        {output && (
             <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
                output.success 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
             }`}>
                {output.success ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {output.success ? "Success" : "Error"}
             </div>
        )}
      </div>

      {/* Console Area */}
      <div className="flex-1 overflow-auto p-4 bg-[#0a0a0a]">
        {output === null ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                    <Terminal className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-sm">Run your code to see the output here</p>
            </div>
        ) : (
            <div className="space-y-3 font-mono text-sm">
                {!output.success && output.error && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                        {output.error}
                    </div>
                )}
                
                {output.output && (
                    <div className="space-y-1">
                        <div className="text-zinc-500 text-xs mb-2 uppercase tracking-wide">Standard Output:</div>
                        <pre className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                            {output.output}
                        </pre>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
