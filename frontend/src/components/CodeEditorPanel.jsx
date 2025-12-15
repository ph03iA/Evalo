import Editor from "@monaco-editor/react";
import { Loader2, Play, RefreshCw, Code2, ChevronDown } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
    selectedLanguage,
    code,
    isRunning,
    onLanguageChange,
    onCodeChange,
    onRunCode,
    onReset,
}) {
    return (
        <div className="h-full flex flex-col bg-[#0a0a0a] rounded-xl overflow-hidden border border-zinc-800">
            {/* Toolbar */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#030303] border border-white/5 text-zinc-400">
                        <Code2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-white">Editor</span>
                    </div>

                    <div className="h-4 w-px bg-white/5" />

                    <div className="relative group">
                        <select
                            className="appearance-none bg-transparent pl-8 pr-8 py-1.5 text-sm font-medium text-zinc-300 hover:text-white outline-none cursor-pointer transition-colors"
                            value={selectedLanguage}
                            onChange={onLanguageChange}
                        >
                            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                                <option key={key} value={key} className="bg-[#0a0a0a]">
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                        <img
                            src={LANGUAGE_CONFIG[selectedLanguage]?.icon}
                            alt="lang"
                            className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 transition-all"
                        />
                        <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onReset}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Reset Code"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onRunCode}
                        disabled={isRunning}
                        className="group relative inline-flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold text-white transition-all duration-200 bg-emerald-500 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                        {isRunning ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-white" />
                                <span>Run</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden relative group">
                <Editor
                    height="100%"
                    language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang}
                    value={code}
                    onChange={onCodeChange}
                    theme="vs-dark"
                    options={{
                        fontSize: 14,
                        fontFamily: "'JetBrains Mono', monospace",
                        lineNumbers: "on",
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20 },
                        cursorSmoothCaretAnimation: "on",
                        renderLineHighlight: "all",
                        smoothScrolling: true,
                        scrollbar: {
                            verticalScrollbarSize: 8,
                            horizontalScrollbarSize: 8,
                        },
                    }}
                    onMount={(editor, monaco) => {
                        // Custom theme to match the app
                        monaco.editor.defineTheme('custom-dark', {
                            base: 'vs-dark',
                            inherit: true,
                            rules: [],
                            colors: {
                                'editor.background': '#0a0a0a',
                                'editor.lineHighlightBackground': '#18181b',
                                'editorLineNumber.foreground': '#52525b',
                            }
                        });
                        monaco.editor.setTheme('custom-dark');
                    }}
                />
            </div>
        </div>
    );
}

export default CodeEditorPanel;
