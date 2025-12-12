import { Link, useNavigate } from "react-router";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import {
  ArrowRightIcon,
  TerminalIcon,
} from "lucide-react";

function HomePage() {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleGetStarted = () => {
    navigate("/problems");
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-400 selection:bg-emerald-500/30 selection:text-emerald-200 font-sans overflow-x-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none opacity-20"></div>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-8 h-8 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                  <TerminalIcon className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <span className="font-bold text-sm text-zinc-100 tracking-wider">EVALO</span>
          </Link>

          <div className="flex items-center gap-8 text-xs font-medium uppercase tracking-widest">
             <button className="hidden md:block hover:text-white transition-colors duration-300 cursor-pointer">Enterprise</button>
             <button className="hidden md:block hover:text-white transition-colors duration-300 cursor-pointer">Solutions</button>
             <div className="h-4 w-px bg-white/10 hidden md:block"></div>
             
             <SignedOut>
               <SignInButton mode="modal">
                 <button className="text-zinc-400 hover:text-white transition-colors duration-300 cursor-pointer">
                   Log In
                 </button>
               </SignInButton>
               <SignInButton mode="modal">
                 <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold tracking-wide shadow-lg shadow-white/5 cursor-pointer">
                    Start Interview
                 </button>
               </SignInButton>
             </SignedOut>

             <SignedIn>
               <button 
                 onClick={handleDashboard}
                 className="bg-white text-black px-6 py-2 rounded-lg hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold tracking-wide shadow-lg shadow-white/5 cursor-pointer"
               >
                  Dashboard
               </button>
               <UserButton afterSignOutUrl="/" />
             </SignedIn>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6">
         {/* HERO */}
         <div className="max-w-5xl mx-auto text-center space-y-8 mb-32 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm mb-4">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span className="text-[10px] uppercase tracking-widest font-semibold text-emerald-400">System Live</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-medium text-white tracking-tighter leading-[1] select-none drop-shadow-2xl">
               The standard for <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600">technical hiring.</span>
            </h1>

            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed">
               A synchronized, ephemeral coding environment designed for precision interviews.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
               <SignedOut>
                 <SignInButton mode="modal">
                   <button className="h-12 px-8 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-500 transition-all shadow-[0_0_50px_-12px_rgba(16,185,129,0.4)] flex items-center gap-3 group border border-emerald-500/50 cursor-pointer">
                      <span>Enter Interview Room</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                   </button>
                 </SignInButton>
               </SignedOut>

               <SignedIn>
                 <button 
                   onClick={handleGetStarted}
                   className="h-12 px-8 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-500 transition-all shadow-[0_0_50px_-12px_rgba(16,185,129,0.4)] flex items-center gap-3 group border border-emerald-500/50 cursor-pointer"
                 >
                    <span>Enter Interview Room</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                 </button>
               </SignedIn>
            </div>
         </div>

         {/* 2D VISUAL */}
         <div className="max-w-6xl mx-auto mb-20 relative group">
             <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] opacity-20 rounded-full group-hover:opacity-30 transition-opacity duration-1000"></div>
             <div className="relative rounded-xl border border-white/10 bg-[#080808] shadow-2xl overflow-hidden">
                <div className="flex h-[500px]">
                    {/* Fake Left Panel */}
                    <div className="w-1/3 border-r border-white/5 bg-[#050505] p-8 hidden md:block">
                        <div className="h-4 w-24 bg-zinc-800 rounded mb-6"></div>
                        <div className="space-y-3">
                            <div className="h-2 w-full bg-zinc-900 rounded"></div>
                            <div className="h-2 w-5/6 bg-zinc-900 rounded"></div>
                            <div className="h-2 w-4/6 bg-zinc-900 rounded"></div>
                        </div>
                        <div className="mt-8 p-4 bg-zinc-900/30 rounded border border-white/5">
                            <div className="h-3 w-16 bg-zinc-800 rounded mb-2"></div>
                            <div className="h-2 w-full bg-zinc-800/50 rounded"></div>
                        </div>
                    </div>
                    {/* Fake Code Editor */}
                    <div className="flex-1 p-8 bg-[#080808]/80 relative">
                        <div className="flex flex-col gap-2 opacity-50 font-mono text-sm">
                            <div className="flex gap-4"><span className="text-zinc-700">1</span> <span className="text-purple-400">class</span> <span className="text-yellow-100">Solution</span>:</div>
                            <div className="flex gap-4"><span className="text-zinc-700">2</span> <span className="pl-4 text-purple-400">def</span> <span className="text-blue-400">twoSum</span>(self, nums, target):</div>
                            <div className="flex gap-4"><span className="text-zinc-700">3</span> <span className="pl-8 text-zinc-500"># Optimized O(n) solution</span></div>
                            <div className="flex gap-4"><span className="text-zinc-700">4</span> <span className="pl-8">seen = {'{}'}</span></div>
                        </div>
                        {/* Fake Video Overlay */}
                        <div className="absolute top-8 right-8 w-40 h-28 bg-zinc-900 rounded-lg border border-white/10 shadow-xl flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-500">JD</div>
                        </div>
                    </div>
                </div>
             </div>
         </div>

         {/* STATS FOOTER */}
         <div className="max-w-5xl mx-auto border-t border-white/5 pt-12 pb-6">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2 text-center md:text-left">
                   <h3 className="text-3xl font-medium text-white tracking-tighter">2.5M+</h3>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Candidates Assessed</p>
                </div>
                <div className="space-y-2 text-center md:text-left">
                   <h3 className="text-3xl font-medium text-white tracking-tighter">140+</h3>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Countries</p>
                </div>
                <div className="space-y-2 text-center md:text-left">
                   <h3 className="text-3xl font-medium text-white tracking-tighter">99.99%</h3>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Uptime SLA</p>
                </div>
                <div className="space-y-2 text-center md:text-left">
                   <h3 className="text-3xl font-medium text-white tracking-tighter">50ms</h3>
                   <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Global Latency</p>
                </div>
             </div>
         </div>
      </main>
    </div>
  );
}

export default HomePage;
