import { Link, useNavigate } from "react-router";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import {
  ArrowRightIcon,
  TerminalIcon,
  ArrowRight, Terminal, CheckCircle2, Play
} from "lucide-react";

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/problems");
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-400 selection:bg-emerald-500/30 selection:text-emerald-200 font-sans overflow-x-clip">

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
                onClick={handleGetStarted}
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold tracking-wide shadow-lg shadow-white/5 cursor-pointer"
              >
                Dashboard
              </button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20">
        {/* HERO + CODE DEMO SIDE BY SIDE */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 mb-20">
          {/* HERO - Left Side */}
          <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left px-6 lg:pl-[max(24px,calc((100vw-1280px)/2+24px))]">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tighter leading-[1] select-none drop-shadow-2xl">
              The standard for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600">technical hiring.</span>
            </h1>

            <p className="text-lg text-zinc-500 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              A synchronized, ephemeral coding environment designed for precision interviews.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
              <SignedOut>
               <SignInButton mode="modal">
                  <button className="h-12 px-8 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-500 transition-all shadow-[0_0_50px_-12px_rgba(16,185,129,0.4)] flex items-center gap-3 group border border-emerald-500/50 cursor-pointer">
                    <span>Enter Interview Room</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
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

          {/* 2D VISUAL - CODE DEMO - Right Side on desktop, below on mobile */}
          <div className="w-full px-6 lg:px-0 lg:flex-shrink-0 lg:w-[1050px] relative group lg:-mr-20 xl:-mr-40">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-20 rounded-2xl group-hover:opacity-30 transition-opacity duration-1000"></div>

          <div className="relative rounded-xl border border-white/10 bg-[#1e1e1e] shadow-2xl overflow-hidden flex flex-col h-[350px] md:h-[400px] lg:h-[500px]">

            {/* MAC TITLE BAR */}
            <div className="h-9 bg-[#2d2d2d] flex items-center px-4 border-b border-[#18181b] shrink-0 justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-inner"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 shadow-inner"></div>
              </div>
              <div className="flex items-center gap-2 opacity-50 text-[11px] font-medium font-sans">
                <Terminal className="w-3 h-3" />
                <span>talent-iq — solution.py</span>
                  </div>
              <div className="w-12"></div> {/* Spacer for alignment */}
               </div>
               
            {/* CONTENT ROW */}
            <div className="flex flex-1 overflow-hidden">
              {/* SIDEBAR (File Explorer) */}
              <div className="w-64 border-r border-[#333] bg-[#18181b] flex flex-col hidden md:flex">
                <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Explorer</span>
                </div>
                <div className="p-2 space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#27272a] rounded text-zinc-300 text-xs cursor-pointer border-l-2 border-emerald-500">
                    <span className="text-blue-400 font-bold">py</span>
                    <span>solution.py</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-[#27272a]/50 rounded text-zinc-500 text-xs cursor-pointer">
                    <span className="text-yellow-400 font-bold">js</span>
                    <span>test_cases.js</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 hover:bg-[#27272a]/50 rounded text-zinc-500 text-xs cursor-pointer">
                    <span className="text-orange-400 font-bold">md</span>
                    <span>README.md</span>
               </div>
            </div>
            
                <div className="mt-auto p-4 border-t border-[#27272a]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-300">All Tests Passed</div>
                      <div className="text-[10px] text-zinc-500">2ms execution time</div>
                    </div>
                  </div>
                </div>
         </div>

              {/* MAIN EDITOR AREA */}
              <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                {/* Tab Bar */}
                <div className="flex items-center h-10 bg-[#1e1e1e] border-b border-[#27272a]">
                  <div className="px-4 h-full bg-[#1e1e1e] border-r border-[#27272a] text-zinc-300 text-xs flex items-center gap-2 border-t-2 border-t-emerald-500">
                    <span className="text-blue-400">py</span>
                    <span>solution.py</span>
                 </div>
                  <div className="flex-1"></div>
                  <div className="px-4 flex items-center gap-3">
                    <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold cursor-pointer hover:text-white">Run Code</span>
            </div>
         </div>

                {/* Code Content */}
                <div className="flex-1 p-6 font-mono text-sm relative overflow-hidden">
                  {/* Cursor Overlay - Live Collab effect */}
                  <div className="absolute top-[170px] left-[240px] z-10 flex flex-col items-start pointer-events-none animate-pulse">
                    <div className="h-4 w-0.5 bg-yellow-400"></div>
                    <div className="bg-yellow-400 text-black text-[9px] font-bold px-1 rounded-sm -mt-0.5">Alex</div>
                  </div>

                  <div className="flex h-full">
                    {/* Line Numbers */}
                    <div className="flex flex-col text-right pr-6 select-none text-[#6e7681] text-xs leading-6 font-mono">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    {/* Actual Code */}
                    <div className="text-[#d4d4d4] text-xs leading-6">
                      <div><span className="text-[#569cd6]">class</span> <span className="text-[#4ec9b0]">Solution</span>:</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#569cd6]">def</span> <span className="text-[#dcdcaa]">twoSum</span>(self, nums, target):</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#6a9955]"># Optimized O(n) solution using hash map</span></div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;seen = <span className="text-[#da70d6]">{`{}`}</span></div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c586c0]">for</span> i, num <span className="text-[#c586c0]">in</span> <span className="text-[#dcdcaa]">enumerate</span>(nums):</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;complement = target - num</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c586c0]">if</span> complement <span className="text-[#c586c0]">in</span> seen:</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c586c0]">return</span> [seen[complement], i]</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;seen[num] = i</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c586c0]">return</span> []</div>
                      <div className="mt-4"><span className="text-[#6a9955]"># Time Complexity: O(n)</span></div>
                      <div><span className="text-[#6a9955]"># Space Complexity: O(n)</span></div>
                    </div>
                  </div>

                  {/* Video Call Overlay */}
                  <div className="absolute top-6 right-40 w-40 h-28 bg-[#27272a] rounded-lg border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex-1 bg-zinc-900 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/30">
                        JD
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 border border-black"></div>
                      </div>
                      <div className="absolute bottom-2 left-2 text-[10px] text-white font-medium">
                        Jane Doe
                      </div>
                    </div>
                    <div className="h-8 bg-[#18181b] flex items-center justify-between px-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                      </div>
                      <div className="w-3 h-3 rounded-full border border-red-500/50 bg-red-500/10"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* STATS FOOTER */}
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-12 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            <div className="space-y-2 text-center">
              <h3 className="text-3xl font-medium text-white tracking-tighter">2.5M+</h3>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Candidates Assessed</p>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-3xl font-medium text-white tracking-tighter">140+</h3>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Countries</p>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-3xl font-medium text-white tracking-tighter">99.99%</h3>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Uptime SLA</p>
            </div>
            <div className="space-y-2 text-center">
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
