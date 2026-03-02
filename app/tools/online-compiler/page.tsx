"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Save } from 'lucide-react';
import { FileCode } from 'lucide-react';
import { Terminal } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import FAQSection from '@/components/FAQSection';

const faqs = [
    {
        question: "Is my code secure when using the Online Compiler?",
        answer: "Yes. Your code is executed in a secure, isolated environment, ensuring that your logic and intellectual property remain private and safe during testing."
    },
    {
        question: "Do I need to install any software to run my code?",
        answer: "No installation is required. You can compile, test, and debug your code instantly on any device with a standard web browser."
    },
    {
        question: "Does the compiler support real-time output?",
        answer: "Yes, our compiler is optimized for speed, providing fast execution and immediate output for your programming and debugging needs."
    }
];

// Define types for global objects loaded via CDN
declare global {
    interface Window {
        require: any;
        monaco: any;
        loadPyodide: any;
        ts: any;
        JSCPP: any;
        fengari: any;
        addToOutput?: (str: string) => void;
    }
}

// Language Configurations
const languages = [
    { id: 'javascript', name: 'JavaScript', icon: 'js', file: 'main.js', mode: 'javascript' },
    { id: 'python', name: 'Python', icon: 'py', file: 'main.py', mode: 'python' },
    { id: 'c', name: 'C', icon: 'c', file: 'main.c', mode: 'c' },
    { id: 'cpp', name: 'C++', icon: 'cpp', file: 'main.cpp', mode: 'cpp' },
    { id: 'html', name: 'HTML / CSS', icon: 'html', file: 'index.html', mode: 'html' },
    { id: 'typescript', name: 'TypeScript', icon: 'ts', file: 'main.ts', mode: 'typescript' },
    { id: 'lua', name: 'Lua', icon: 'lua', file: 'main.lua', mode: 'lua' }
] as const;

type LanguageId = typeof languages[number]['id'];

const templates: Record<LanguageId, string> = {
    javascript: `console.log("Hello from JavaScript!");`,
    python: `def main():\n    print("Hello from Python!")\n\nif __name__ == "__main__":\n    main()`,
    c: `#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}`,
    cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}`,
    html: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: sans-serif; padding: 20px; }\n    h1 { color: #007acc; }\n    p { color: #ccc; }\n  </style>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>Rendered in Real-time!</p>\n</body>\n</html>`,
    typescript: `const greeting: string = "Hello from TypeScript!";\nconsole.log(greeting);`,
    lua: `print("Hello from Lua!")`
};

export default function OnlineCompiler() {
    const [activeLang, setActiveLang] = useState<LanguageId>('javascript');
    const [code, setCode] = useState(templates.javascript);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [stdInput, setStdInput] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [status, setStatus] = useState<'ready' | 'running' | 'saved'>('ready');
    const [pyodide, setPyodide] = useState<any>(null);
    const [editorLoaded, setEditorLoaded] = useState(false);

    // External Scripts Loading State
    const [scriptsLoaded, setScriptsLoaded] = useState({
        monaco: false,
        pyodide: false,
        jscpp: false,
        fengari: false,
        typescript: false
    });

    const editorContainerRef = useRef<HTMLDivElement>(null);
    const editorInstanceRef = useRef<any>(null);

    // Load Monaco CDN
    useEffect(() => {
        if (!scriptsLoaded.monaco && typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js";
            script.async = true;
            script.onload = () => {
                window.require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
                window.require(['vs/editor/editor.main'], function () {
                    setScriptsLoaded(prev => ({ ...prev, monaco: true }));
                });
            };
            document.body.appendChild(script);
        }
    }, [scriptsLoaded.monaco]);

    // Initialize Editor
    useEffect(() => {
        if (scriptsLoaded.monaco && editorContainerRef.current && !editorInstanceRef.current && typeof window !== 'undefined' && window.monaco) {
            try {
                editorInstanceRef.current = window.monaco.editor.create(editorContainerRef.current, {
                    value: code,
                    language: languages.find(l => l.id === activeLang)?.mode || 'javascript',
                    theme: 'vs-dark', // Force dark theme for now
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    automaticLayout: true,
                    minimap: { enabled: false },
                    padding: { top: 15 },
                    suggest: {
                        showKeywords: true,
                        showSnippets: true,
                    }
                });

                editorInstanceRef.current.onDidChangeModelContent(() => {
                    const val = editorInstanceRef.current.getValue();
                    setCode(val);
                });

                setEditorLoaded(true);
            } catch (error) {
                console.error("Failed to initialize Monaco Editor:", error);
            }
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.dispose();
                editorInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scriptsLoaded.monaco]); // Run once when monaco loads

    // Update Editor Language and Code when activeLang changes
    useEffect(() => {
        if (editorInstanceRef.current && editorLoaded && typeof window !== 'undefined' && window.monaco) {
            const saved = localStorage.getItem(`code_${activeLang}`);
            const newCode = saved || templates[activeLang as LanguageId] || '';

            const model = editorInstanceRef.current.getModel();
            if (model) {
                window.monaco.editor.setModelLanguage(model, languages.find(l => l.id === activeLang)?.mode || 'plaintext');
                editorInstanceRef.current.setValue(newCode);
            }
            setCode(newCode);
            setOutput('');
        }
    }, [activeLang, editorLoaded]);

    // Auto-save logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(`code_${activeLang}`, code);
            }
            setStatus('saved');
            setTimeout(() => setStatus('ready'), 1000);
        }, 1000);
        return () => clearTimeout(timer);
    }, [code, activeLang]);

    // Load Pyodide
    useEffect(() => {
        if (!scriptsLoaded.pyodide && activeLang === 'python' && typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
            script.async = true;
            script.onload = async () => {
                try {
                    if (window.loadPyodide) {
                        const py = await window.loadPyodide();
                        setPyodide(py);
                        setScriptsLoaded(prev => ({ ...prev, pyodide: true }));
                    }
                } catch (e) {
                    console.error("Pyodide failed to load", e);
                }
            };
            document.body.appendChild(script);
        }
    }, [activeLang, scriptsLoaded.pyodide]);

    // Load JSCPP
    useEffect(() => {
        if (!scriptsLoaded.jscpp && (activeLang === 'c' || activeLang === 'cpp') && typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/gh/felixhao28/JSCPP@gh-pages/dist/JSCPP.es5.min.js";
            script.async = true;
            script.onload = () => setScriptsLoaded(prev => ({ ...prev, jscpp: true }));
            document.body.appendChild(script);
        }
    }, [activeLang, scriptsLoaded.jscpp]);

    // Load TypeScript
    useEffect(() => {
        if (!scriptsLoaded.typescript && activeLang === 'typescript' && typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/typescript/5.3.3/typescript.min.js";
            script.async = true;
            script.onload = () => setScriptsLoaded(prev => ({ ...prev, typescript: true }));
            document.body.appendChild(script);
        }
    }, [activeLang, scriptsLoaded.typescript]);

    // Load Lua
    useEffect(() => {
        if (!scriptsLoaded.fengari && activeLang === 'lua' && typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = "https://github.com/fengari-lua/fengari-web/releases/download/v0.1.4/fengari-web.js";
            script.async = true;
            script.onload = () => setScriptsLoaded(prev => ({ ...prev, fengari: true }));
            document.body.appendChild(script);
        }
    }, [activeLang, scriptsLoaded.fengari]);

    const runCode = async () => {
        setIsRunning(true);
        setOutput('');

        try {
            switch (activeLang) {
                case 'javascript':
                    await runJS(code);
                    break;
                case 'python':
                    await runPython(code);
                    break;
                case 'typescript':
                    await runTS(code);
                    break;
                case 'c':
                case 'cpp':
                    await runCpp(code);
                    break;
                case 'lua':
                    await runLua(code);
                    break;
                case 'html':
                    // Handled by iframe rendering
                    break;
                default:
                    setOutput('Language not supported for execution yet.');
            }
        } catch (error: any) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const runJS = async (codeToRun: string) => {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
            logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        try {
            // eslint-disable-next-line no-new-func
            new Function(codeToRun)();
        } catch (e: any) {
            throw new Error(e.message);
        } finally {
            console.log = originalLog;
        }
        setOutput(logs.length ? logs.join('\n') : "No output returned.");
    };

    const runPython = async (codeToRun: string) => {
        if (!pyodide) {
            throw new Error("Python environment loading... try again in a moment.");
        }
        try {
            pyodide.setStdout({ batched: (msg: string) => setOutput(prev => prev + msg + "\n") });
            pyodide.setStdin({ stdin: () => stdInput });
            await pyodide.runPythonAsync(codeToRun);
        } catch (e: any) {
            throw new Error(e.message);
        }
    };

    const runTS = async (codeToRun: string) => {
        if (!window.ts) throw new Error("TypeScript compiler not loaded.");
        try {
            const js = window.ts.transpile(codeToRun);
            await runJS(js);
        } catch (e: any) {
            throw new Error("Transpilation Failed: " + e.message);
        }
    };

    const runCpp = async (codeToRun: string) => {
        if (!window.JSCPP) throw new Error("JSCPP not loaded.");
        try {
            const config = {
                stdio: {
                    write: (s: string) => setOutput(prev => prev + s),
                    read: () => stdInput
                },
                unsigned_overflow: 'report',
            };
            await window.JSCPP.run(codeToRun, stdInput, config);
        } catch (e: any) {
            throw new Error(`Runtime Error: ${e.message || e}`);
        }
    };

    const runLua = async (codeToRun: string) => {
        if (!window.fengari) throw new Error("Fengari (Lua) not loaded.");

        let outputBuffer = "";
        const luaWrapper = `
            local js = require "js"
            local window = js.global
            local print = function(...) 
                local args = {...}
                local str = ""
                for i,v in ipairs(args) do
                    str = str .. tostring(v) .. "\\t"
                end
                window:addToOutput(str)
            end
            ${codeToRun}
        `;

        window.addToOutput = (str: string) => {
            outputBuffer += str + "\n";
            setOutput(outputBuffer);
        };

        try {
            window.fengari.load(luaWrapper)();
        } catch (e: any) {
            throw new Error(`Lua Error: ${e.message.replace('Lua Error: ', '')}`);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight text-black">
                    Multi-Language <span className="text-black">Online Compiler</span>
                </h1>
                <p className="text-gray-800 max-w-2xl mx-auto text-lg">
                    Write, test, and execute code in Python, JavaScript, C++, and more directly in your browser. 100% Secure, Private, and Client-side.
                </p>
            </div>

            <div className="flex flex-col h-[750px] shrink-0 border-y border-gray-200 bg-white shadow-sm overflow-hidden relative z-0">
                {/* Compiler Header */}
                <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
                        {languages.map(lang => (
                            <button
                                key={lang.id}
                                onClick={() => setActiveLang(lang.id as LanguageId)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${activeLang === lang.id
                                    ? 'bg-white text-black border-2 border-black border-black shadow-sm'
                                    : 'bg-transparent text-gray-800 border-gray-200 hover:border-black'
                                    }`}
                            >
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-800">
                            {status === 'saved' ? <><CheckCircle className="w-3 h-3 text-green-500" /> SAVED</> : <><Save className="w-3 h-3" /> AUTO-SAVE</>}
                        </div>
                        <button
                            onClick={runCode}
                            disabled={isRunning || activeLang === 'html'}
                            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-none font-bold text-sm tracking-wide shadow-none flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
                        >
                            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            RUN CODE
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white relative">
                    {/* Editor Section */}
                    <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
                        <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-4 text-xs font-mono text-gray-800 uppercase tracking-wider">
                            <span className="flex items-center gap-2 font-semibold">
                                <FileCode className="w-3 h-3" />
                                {languages.find(l => l.id === activeLang)?.file}
                            </span>
                        </div>
                        <div className="flex-1 relative bg-white">
                            {!scriptsLoaded.monaco && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-mono text-sm z-50 bg-white border border-white/5">
                                    <Loader2 className="w-5 h-5 animate-spin mr-3 text-black" /> INITIALIZING EDITOR...
                                </div>
                            )}
                            <div ref={editorContainerRef} className="absolute inset-0 w-full h-full" />
                        </div>
                    </div>

                    {/* Output Section */}
                    {(activeLang === 'html') ? (
                        <div className="flex-1 bg-white h-full relative border-t md:border-t-0 border-gray-200">
                            <iframe
                                title="preview"
                                srcDoc={code}
                                className="w-full h-full border-none"
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className="h-[40vh] md:h-full md:w-[40%] bg-gray-50 flex flex-col border-t md:border-t-0 border-gray-200 relative z-0">
                            <div className="h-10 bg-gray-200 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
                                <span className="text-xs font-bold uppercase text-gray-800 flex items-center gap-2 tracking-wider">
                                    <Terminal className="w-3 h-3" /> Terminal
                                </span>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer font-mono hover:text-black transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={showInput}
                                            onChange={() => setShowInput(!showInput)}
                                            className="rounded-none border-gray-400 text-black focus:ring-black w-3 h-3"
                                        />
                                        STDIN
                                    </label>
                                    <button onClick={() => setOutput('')} className="text-gray-800 hover:text-black transition-colors">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {showInput && (
                                <div className="p-2 bg-gray-200 border-b border-gray-200 shrink-0">
                                    <textarea
                                        value={stdInput}
                                        onChange={(e) => setStdInput(e.target.value)}
                                        placeholder="Enter stdin input here..."
                                        className="w-full h-24 text-sm font-mono p-3 rounded-none border border-gray-300 bg-white focus:outline-none focus:border-black text-black resize-none placeholder-gray-600"
                                    />
                                </div>
                            )}

                            <div className="flex-1 p-4 font-mono text-sm overflow-auto whitespace-pre-wrap text-black selection:bg-gray-200">
                                {output || <span className="text-gray-700 italic font-sans">Run code to see output...</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* How It Works Section */}
            <div className="container mx-auto px-4 py-6 sm:py-16 max-w-5xl">
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Terminal className="w-48 h-48 text-black" />
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-6 relative z-10">How Our Online Compiler Works</h2>
                    <div className="prose prose-gray max-w-none text-gray-800 space-y-4 relative z-10">
                        <p>
                            Writing and testing code usually requires setting up complex local development environments, installing compilers, and configuring paths. Our Online Compiler bypasses all that friction, offering a complete, multi-language Integrated Development Environment (IDE) directly within your web browser. It is fast, secure, and entirely client-side.
                        </p>
                        <p>
                            The core of our text editor is powered by <strong>Monaco Editor</strong>, the very same technology that underpins Microsoft&apos;s popular VS Code. This provides you with professional-grade features such as syntax highlighting, code folding, bracket matching, and intelligent autocompletion right out of the box. As you type, your code is automatically cached in your browser&apos;s local storage, ensuring you never lose your work even if you accidentally close the tab.
                        </p>
                        <h3 className="text-xl font-semibold text-black mt-6 mb-3">Client-Side Execution</h3>
                        <p>
                            What truly sets this compiler apart is how the code is executed. Instead of sending your sensitive code to a remote server for processing, we run the code locally on your machine using advanced WebAssembly (Wasm) and JavaScript translation techniques. This guarantees absolute privacy and instantaneous execution speeds without any server latency.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>JavaScript & HTML:</strong> These run natively in your browser using secure iframes and the Javascript Engine.</li>
                            <li><strong>Python:</strong> We utilize <em>Pyodide</em>, a full Python distribution compiled to WebAssembly. This allows fully featured Python scripts to run at near-native speeds.</li>
                            <li><strong>C & C++:</strong> We leverage <em>JSCPP</em>, a C/C++ interpreter written in JavaScript, to securely execute your systems-level code in a sandboxed environment.</li>
                            <li><strong>TypeScript:</strong> Your TS code is instantly transpiled to JavaScript using the official compiler API before being evaluated.</li>
                            <li><strong>Lua:</strong> We use <em>Fengari</em>, the Lua VM rewritten in JS, allowing seamless execution of Lua scripts.</li>
                        </ul>
                        <h3 className="text-xl font-semibold text-black mt-6 mb-3">Interacting with Your Code</h3>
                        <p>
                            The integrated terminal window captures all `stdout` output from your programs in real-time. If your program requires user input (e.g., waiting for a `scanf` in C or `input()` in Python), you can easily toggle the STDIN panel to provide data to your running scripts. It is a fully self-contained environment perfect for learning algorithms, testing snippets, or preparing for coding interviews.
                        </p>
                    </div>

                    <FAQSection faqs={faqs} />

                    {false && (
                        <div className="mt-12 relative z-10">
                            <h2 className="text-2xl font-bold text-black mb-6">Video Tutorial</h2>
                            <div className="relative w-full overflow-hidden rounded-2xl bg-white border border-gray-200" style={{ paddingTop: '56.25%' }}>
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                                    title="Online Compiler Tutorial Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
