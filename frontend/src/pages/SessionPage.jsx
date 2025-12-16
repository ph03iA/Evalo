import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyColor } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useUser();
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

    const joinSessionMutation = useJoinSession();
    const endSessionMutation = useEndSession();

    const session = sessionData?.session;
    const isHost = session?.host?.clerkId === user?.id;
    const isParticipant = session?.participant?.clerkId === user?.id;

    const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
        session,
        loadingSession,
        isHost,
        isParticipant
    );

    const problemData = session?.problem
        ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
        : null;

    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");


    useEffect(() => {
        if (!session || !user || loadingSession) return;
        if (isHost || isParticipant) return;
        if (session.status === "completed") return; // Don't try to join completed sessions
        if (joinSessionMutation.isPending) return; // Prevent duplicate calls

        joinSessionMutation.mutate(id, { onSuccess: refetch });
    }, [session, user, loadingSession, isHost, isParticipant, id]);

    useEffect(() => {
        if (!session || loadingSession) return;
        if (session.status === "completed") navigate("/dashboard");
    }, [session, loadingSession, navigate]);

    useEffect(() => {
        if (problemData?.starterCode?.[selectedLanguage]) {
            setCode(problemData.starterCode[selectedLanguage]);
        }
    }, [problemData, selectedLanguage]);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setSelectedLanguage(newLang);
        const starterCode = problemData?.starterCode?.[newLang] || "";
        setCode(starterCode);
        setOutput(null);
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);
        const result = await executeCode(selectedLanguage, code);
        setOutput(result);
        setIsRunning(false);
    };

    const handleEndSession = () => {
        if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
            endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
        }
    };

    return (
        <div className="h-screen bg-[#030303] flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 overflow-hidden p-2">
                <PanelGroup direction="horizontal">
                    {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
                    <Panel defaultSize={50} minSize={30}>
                        <PanelGroup direction="vertical">
                            {/* PROBLEM DESCRIPTION PANEL */}
                            <Panel defaultSize={50} minSize={20}>
                                <div className="h-full overflow-hidden p-1">
                                    <div className="h-full flex flex-col bg-[#0a0a0a] text-zinc-400 relative rounded-xl overflow-hidden border border-zinc-800">
                                        {/* Header */}
                                        <div className="p-6 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm sticky top-0 z-10">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(session?.difficulty)}`}>
                                                        {session?.difficulty || "Easy"}
                                                    </div>
                                                    {problemData?.category && (
                                                        <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
                                                            {problemData.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {isHost && session?.status === "active" && (
                                                        <button
                                                            onClick={handleEndSession}
                                                            disabled={endSessionMutation.isPending}
                                                            className="h-10 px-6 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500 transition-all shadow-[0_0_50px_-12px_rgba(239,68,68,0.4)] flex items-center gap-2 group border border-red-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {endSessionMutation.isPending ? (
                                                                <Loader2Icon className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <LogOutIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                            )}
                                                            <span>End Session</span>
                                                        </button>
                                                    )}
                                                    {session?.status === "completed" && (
                                                        <span className="px-2.5 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px] uppercase tracking-wider">Completed</span>
                                                    )}
                                                </div>
                                            </div>
                                            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                                {session?.problem || "Loading..."}
                                            </h1>
                                            <p className="text-zinc-500 text-sm">
                                                Host: <span className="text-zinc-300">{session?.host?.name || "Loading..."}</span> •{" "}
                                                <span className="text-emerald-400">{session?.participant ? 2 : 1}/2</span> participants
                                            </p>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                            {/* Description Text */}
                                            {problemData?.description && (
                                                <div>
                                                    <div className="text-white font-semibold mb-3 text-lg">Description</div>
                                                    <p className="text-zinc-400 leading-relaxed text-sm">{problemData.description.text}</p>
                                                    {problemData.description.notes?.length > 0 && (
                                                        <div className="mt-4 space-y-2">
                                                            {problemData.description.notes.map((note, idx) => (
                                                                <div key={idx} className="flex gap-2 text-zinc-400 text-sm">
                                                                    <span className="text-emerald-500 mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 bg-emerald-500" />
                                                                    <span>{note}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Examples */}
                                            {problemData?.examples && problemData.examples.length > 0 && (
                                                <div>
                                                    <div className="text-white font-semibold mb-4 text-lg">Examples</div>
                                                    <div className="space-y-4">
                                                        {problemData.examples.map((example, index) => (
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
                                            )}

                                            {/* Constraints */}
                                            {problemData?.constraints && problemData.constraints.length > 0 && (
                                                <div>
                                                    <div className="text-white font-semibold mb-3 text-lg">Constraints</div>
                                                    <ul className="space-y-2">
                                                        {problemData.constraints.map((constraint, idx) => (
                                                            <li key={idx} className="flex gap-3 text-sm font-mono text-zinc-400 bg-white/5 p-2 rounded-lg border border-white/5">
                                                                <span className="text-emerald-500 select-none">•</span>
                                                                {constraint}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Panel>

                            <PanelResizeHandle className="h-1.5 bg-zinc-800 hover:bg-emerald-500 transition-colors cursor-row-resize rounded-full" />

                            <Panel defaultSize={50} minSize={20}>
                                <PanelGroup direction="vertical">
                                    <Panel defaultSize={70} minSize={30}>
                                        <div className="h-full overflow-hidden p-1">
                                            <CodeEditorPanel
                                                selectedLanguage={selectedLanguage}
                                                code={code}
                                                isRunning={isRunning}
                                                onLanguageChange={handleLanguageChange}
                                                onCodeChange={(value) => setCode(value)}
                                                onRunCode={handleRunCode}
                                            />
                                        </div>
                                    </Panel>

                                    <PanelResizeHandle className="h-1.5 bg-zinc-800 hover:bg-emerald-500 transition-colors cursor-row-resize rounded-full" />

                                    <Panel defaultSize={30} minSize={15}>
                                        <div className="h-full overflow-hidden p-1">
                                            <OutputPanel output={output} />
                                        </div>
                                    </Panel>
                                </PanelGroup>
                            </Panel>
                        </PanelGroup>
                    </Panel>

                    <PanelResizeHandle className="w-1.5 bg-zinc-800 hover:bg-emerald-500 transition-colors cursor-col-resize rounded-full" />

                    {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
                    <Panel defaultSize={50} minSize={30}>
                        <div className="h-full bg-zinc-900/30 rounded-xl border border-zinc-800 p-4 overflow-auto">
                            {isInitializingCall ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-emerald-400 mb-4" />
                                        <p className="text-zinc-300">Connecting to video call...</p>
                                    </div>
                                </div>
                            ) : !streamClient || !call ? (
                                <div className="h-full flex items-center justify-center">
                                    <div className="bg-zinc-900/50 rounded-xl p-8 border border-zinc-800 max-w-md text-center">
                                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <PhoneOffIcon className="w-10 h-10 text-red-400" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-zinc-100 mb-2">Connection Failed</h2>
                                        <p className="text-zinc-500">Unable to connect to the video call</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full">
                                    <StreamVideo client={streamClient}>
                                        <StreamCall call={call}>
                                            <VideoCallUI chatClient={chatClient} channel={channel} />
                                        </StreamCall>
                                    </StreamVideo>
                                </div>
                            )}
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
}

export default SessionPage;