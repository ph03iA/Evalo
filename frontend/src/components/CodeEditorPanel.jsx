import Editor from "@monaco-editor/react";
import { Loader2, Play, RefreshCw, Code2, ChevronDown } from "lucide-react";
import { memo, useCallback, useEffect, useRef } from "react";
import { LANGUAGE_CONFIG } from "../data/problems";

const EDITOR_OPTIONS = {
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
};

const CURSOR_COLORS = [
    { color: "#34d399", selection: "rgba(52, 211, 153, 0.24)", text: "#022c22" },
    { color: "#60a5fa", selection: "rgba(96, 165, 250, 0.24)", text: "#061b3a" },
    { color: "#f472b6", selection: "rgba(244, 114, 182, 0.24)", text: "#3b0622" },
    { color: "#fbbf24", selection: "rgba(251, 191, 36, 0.24)", text: "#2d1f02" },
    { color: "#a78bfa", selection: "rgba(167, 139, 250, 0.24)", text: "#21124a" },
    { color: "#2dd4bf", selection: "rgba(45, 212, 191, 0.24)", text: "#042f2e" },
];

const hashValue = (value) => {
    const text = String(value || "participant");
    let hash = 0;

    for (let index = 0; index < text.length; index += 1) {
        hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
    }

    return hash;
};

const getCursorPresentation = (id) => {
    const hash = hashValue(id);
    const colorSet = CURSOR_COLORS[hash % CURSOR_COLORS.length];

    return {
        ...colorSet,
        className: `evalo-remote-cursor-${hash.toString(36)}`,
    };
};

const getCursorDisplayName = (name) => {
    const displayName = String(name || "Participant").trim();
    return displayName.length > 32 ? `${displayName.slice(0, 29)}...` : displayName || "Participant";
};

function CodeEditorPanel({
    selectedLanguage,
    code,
    isRunning,
    onLanguageChange,
    onCodeChange,
    onCursorChange,
    onRunCode,
    onReset,
    remoteCursors = [],
}) {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const cursorDecorationsRef = useRef(null);
    const cursorDecorationIdsRef = useRef([]);
    const cursorWidgetsRef = useRef(new Map());
    const cursorStyleElementRef = useRef(null);
    const editorDisposablesRef = useRef([]);
    const isApplyingExternalValueRef = useRef(false);

    const syncCursorStyles = useCallback((presentations) => {
        if (typeof document === "undefined") return;

        if (!cursorStyleElementRef.current) {
            const styleElement = document.createElement("style");
            styleElement.setAttribute("data-evalo-remote-cursors", "true");
            document.head.appendChild(styleElement);
            cursorStyleElementRef.current = styleElement;
        }

        cursorStyleElementRef.current.textContent = Array.from(presentations.values())
            .map(
                ({ className, color, selection }) => `
.monaco-editor .evalo-remote-cursor-caret.${className} {
    border-left-color: ${color};
    box-shadow: 0 0 10px ${selection};
}

.monaco-editor .evalo-remote-selection.${className} {
    background: ${selection};
}
`
            )
            .join("\n");
    }, []);

    const clampPosition = useCallback((position) => {
        const editor = editorRef.current;
        const model = editor?.getModel();
        if (!model || !position) return null;

        const lineNumber = Math.min(Math.max(Number(position.lineNumber) || 1, 1), model.getLineCount());
        const column = Math.min(Math.max(Number(position.column) || 1, 1), model.getLineMaxColumn(lineNumber));

        return { lineNumber, column };
    }, []);

    const getNormalizedSelectionRange = useCallback((selection, monaco) => {
        if (!selection) return null;

        const startPosition = clampPosition({
            lineNumber: selection.startLineNumber,
            column: selection.startColumn,
        });
        const endPosition = clampPosition({
            lineNumber: selection.endLineNumber,
            column: selection.endColumn,
        });

        if (!startPosition || !endPosition) return null;
        if (startPosition.lineNumber === endPosition.lineNumber && startPosition.column === endPosition.column) {
            return null;
        }

        return new monaco.Range(
            startPosition.lineNumber,
            startPosition.column,
            endPosition.lineNumber,
            endPosition.column
        );
    }, [clampPosition]);

    const updateLocalCursor = useCallback(() => {
        const editor = editorRef.current;
        const position = editor?.getPosition();
        const selection = editor?.getSelection();

        if (!position || !selection) return;

        onCursorChange?.({
            position: {
                lineNumber: position.lineNumber,
                column: position.column,
            },
            selection: {
                startLineNumber: selection.startLineNumber,
                startColumn: selection.startColumn,
                endLineNumber: selection.endLineNumber,
                endColumn: selection.endColumn,
            },
        });
    }, [onCursorChange]);

    const updateCursorWidgetNode = useCallback((node, cursor, presentation) => {
        const label = node.querySelector("[data-cursor-label]");

        node.className = `evalo-remote-cursor-label ${presentation.className}`;
        node.style.setProperty("--evalo-cursor-color", presentation.color);
        node.style.setProperty("--evalo-cursor-text", presentation.text);

        if (label) {
            label.textContent = getCursorDisplayName(cursor.name);
        }
    }, []);

    const getCursorWidget = useCallback((cursor, presentation) => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;
        if (!editor || !monaco) return null;

        const widgetId = `evalo-remote-cursor-${cursor.id}`;
        const existingWidget = cursorWidgetsRef.current.get(cursor.id);

        if (existingWidget) {
            updateCursorWidgetNode(existingWidget.node, cursor, presentation);
            return existingWidget;
        }

        const node = document.createElement("div");
        const label = document.createElement("span");
        label.setAttribute("data-cursor-label", "true");
        node.appendChild(label);
        updateCursorWidgetNode(node, cursor, presentation);

        const widget = {
            node,
            position: cursor.position,
            getId: () => widgetId,
            getDomNode: () => node,
            getPosition: () => ({
                position: widget.position,
                preference: [
                    monaco.editor.ContentWidgetPositionPreference.ABOVE,
                    monaco.editor.ContentWidgetPositionPreference.EXACT,
                ],
            }),
        };

        cursorWidgetsRef.current.set(cursor.id, widget);
        editor.addContentWidget(widget);

        return widget;
    }, [updateCursorWidgetNode]);

    const applyExternalValue = useCallback((nextValue) => {
        const editor = editorRef.current;
        if (!editor || typeof nextValue !== "string") return;

        const model = editor.getModel();
        if (!model || model.getValue() === nextValue) return;

        const position = editor.getPosition();
        const scrollTop = editor.getScrollTop();
        const scrollLeft = editor.getScrollLeft();

        isApplyingExternalValueRef.current = true;
        editor.executeEdits("external-sync", [
            {
                range: model.getFullModelRange(),
                text: nextValue,
            },
        ]);

        if (position) {
            const lineNumber = Math.min(position.lineNumber, model.getLineCount());
            const column = Math.min(position.column, model.getLineMaxColumn(lineNumber));
            editor.setPosition({ lineNumber, column });
        }

        editor.setScrollTop(scrollTop);
        editor.setScrollLeft(scrollLeft);

        window.setTimeout(() => {
            isApplyingExternalValueRef.current = false;
        }, 0);
    }, []);

    useEffect(() => {
        applyExternalValue(code || "");
    }, [applyExternalValue, code]);

    useEffect(() => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;
        const model = editor?.getModel();

        if (!editor || !monaco || !model) return;

        const visibleCursorIds = new Set();
        const visibleCursorPresentations = new Map();
        const decorations = [];

        remoteCursors
            .forEach((cursor) => {
                const position = clampPosition(cursor.position);
                if (!position) return;

                visibleCursorIds.add(cursor.id);
                const presentation = getCursorPresentation(cursor.id);
                visibleCursorPresentations.set(presentation.className, presentation);

                const selectionRange = getNormalizedSelectionRange(cursor.selection, monaco);
                if (selectionRange) {
                    decorations.push({
                        range: selectionRange,
                        options: {
                            className: `evalo-remote-selection ${presentation.className}`,
                        },
                    });
                }

                decorations.push({
                    range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                    options: {
                        beforeContentClassName: `evalo-remote-cursor-caret ${presentation.className}`,
                        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                    },
                });

                const widget = getCursorWidget({
                    ...cursor,
                    name: getCursorDisplayName(cursor.name),
                    position,
                }, presentation);

                if (widget) {
                    widget.position = position;
                    editor.layoutContentWidget(widget);
                }
            });

        cursorWidgetsRef.current.forEach((widget, cursorId) => {
            if (!visibleCursorIds.has(cursorId)) {
                editor.removeContentWidget(widget);
                cursorWidgetsRef.current.delete(cursorId);
            }
        });

        syncCursorStyles(visibleCursorPresentations);

        if (cursorDecorationsRef.current) {
            cursorDecorationsRef.current.set(decorations);
        } else {
            cursorDecorationIdsRef.current = editor.deltaDecorations(cursorDecorationIdsRef.current, decorations);
        }
    }, [clampPosition, getCursorWidget, getNormalizedSelectionRange, remoteCursors, selectedLanguage, syncCursorStyles]);

    const handleEditorChange = useCallback(
        (value) => {
            if (isApplyingExternalValueRef.current) return;
            onCodeChange?.(value || "");

            window.setTimeout(updateLocalCursor, 0);
        },
        [onCodeChange, updateLocalCursor]
    );

    const handleEditorMount = useCallback(
        (editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;
            cursorDecorationsRef.current = editor.createDecorationsCollection?.([]);

            // Custom theme to match the app
            monaco.editor.defineTheme("custom-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [],
                colors: {
                    "editor.background": "#0a0a0a",
                    "editor.lineHighlightBackground": "#18181b",
                    "editorLineNumber.foreground": "#52525b",
                },
            });
            monaco.editor.setTheme("custom-dark");
            applyExternalValue(code || "");

            editorDisposablesRef.current.forEach((disposable) => disposable.dispose());
            editorDisposablesRef.current = [
                editor.onDidChangeCursorSelection(updateLocalCursor),
                editor.onDidFocusEditorText(updateLocalCursor),
                editor.onDidBlurEditorText(updateLocalCursor),
            ];

            window.setTimeout(updateLocalCursor, 0);
        },
        [applyExternalValue, code, updateLocalCursor]
    );

    const disposeEditorResources = useCallback(() => {
        editorDisposablesRef.current.forEach((disposable) => disposable.dispose());
        cursorWidgetsRef.current.forEach((widget) => editorRef.current?.removeContentWidget(widget));
        cursorWidgetsRef.current.clear();
        cursorDecorationsRef.current?.clear();
        cursorStyleElementRef.current?.remove();
        cursorStyleElementRef.current = null;
        onCursorChange?.(null);
    }, [onCursorChange]);

    useEffect(() => {
        return disposeEditorResources;
    }, [disposeEditorResources]);

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
                    defaultValue={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={EDITOR_OPTIONS}
                    onMount={handleEditorMount}
                />
            </div>
        </div>
    );
}

export default memo(CodeEditorPanel);
