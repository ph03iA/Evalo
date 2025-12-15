import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentProblemId, setCurrentProblemId] = useState("two-sum");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const currentProblem = PROBLEMS[currentProblemId];

    // Scroll to top when navigating to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // update problem when URL param changes
    useEffect(() => {
        if (id && PROBLEMS[id]) {
            setCurrentProblemId(id);
            setCode(PROBLEMS[id].starterCode[selectedLanguage]);
            setOutput(null);
        }
    }, [id, selectedLanguage]);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setSelectedLanguage(newLang);
        setCode(currentProblem.starterCode[newLang]);
        setOutput(null);
    };

    const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

    const handleResetCode = () => {
        setCode(currentProblem.starterCode[selectedLanguage]);
        setOutput(null);
        toast.success("Code reset to starter template");
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.2, y: 0.6 },
        });

        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.8, y: 0.6 },
        });
    };

    const normalizeOutput = (output) => {
        // normalize output for comparison (trim whitespace, handle different spacing)
        return output
            .trim()
            .split("\n")
            .map((line) =>
                line
                    .trim()
                    // remove spaces after [ and before ]
                    .replace(/\[\s+/g, "[")
                    .replace(/\s+\]/g, "]")
                    // normalize spaces around commas to single space after comma
                    .replace(/\s*,\s*/g, ",")
            )
            .filter((line) => line.length > 0)
            .join("\n");
    };

    const checkIfTestsPassed = (actualOutput, expectedOutput) => {
        const normalizedActual = normalizeOutput(actualOutput);
        const normalizedExpected = normalizeOutput(expectedOutput);

        return normalizedActual == normalizedExpected;
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        const result = await executeCode(selectedLanguage, code);
        setOutput(result);
        setIsRunning(false);

        // check if code executed successfully and matches expected output

        if (result.success) {
            const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
            const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

            if (testsPassed) {
                triggerConfetti();
                toast.success("All tests passed! Great job!");
            } else {
                toast.error("Tests failed. Check your output!");
            }
        } else {
            toast.error("Code execution failed!");
        }
    };

    return (
        <div className="h-screen bg-[#030303] flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 overflow-hidden p-2">
                <PanelGroup direction="horizontal">
                    {/* left panel- problem desc */}
                    <Panel defaultSize={40} minSize={30}>
                        <div className="h-full overflow-hidden p-1">
                            <ProblemDescription
                                problem={currentProblem}
                                currentProblemId={currentProblemId}
                                onProblemChange={handleProblemChange}
                                allProblems={Object.values(PROBLEMS)}
                            />
                        </div>
                    </Panel>

                    <PanelResizeHandle className="w-1.5 bg-zinc-800 hover:bg-emerald-500 transition-colors cursor-col-resize rounded-full" />

                    {/* right panel- code editor & output */}
                    <Panel defaultSize={60} minSize={30}>
                        <PanelGroup direction="vertical">
                            {/* Top panel - Code editor */}
                            <Panel defaultSize={70} minSize={30}>
                                <div className="h-full overflow-hidden p-1">
                                    <CodeEditorPanel
                                        selectedLanguage={selectedLanguage}
                                        code={code}
                                        isRunning={isRunning}
                                        onLanguageChange={handleLanguageChange}
                                        onCodeChange={setCode}
                                        onRunCode={handleRunCode}
                                        onReset={handleResetCode}
                                    />
                                </div>
                            </Panel>

                            <PanelResizeHandle className="h-1.5 bg-zinc-800 hover:bg-emerald-500 transition-colors cursor-row-resize rounded-full" />

                            {/* Bottom panel - Output Panel*/}
                            <Panel defaultSize={30} minSize={20}>
                                <div className="h-full overflow-hidden p-1">
                                    <OutputPanel output={output} />
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
}

export default ProblemPage;   