import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { useLocation } from "react-router-dom";
import ReactResizeDetector from "react-resize-detector";
import io from "socket.io-client";
import { useDatabase } from "../contexts/DatabaseContext";
import { IProgram } from "../contexts/DatabaseContext";

// import "./Editor.css";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

export default function Editor() {
    const { programs, loading, createProgram, updateProgramCode } = useDatabase();

    const [socket, setSocket] = useState<any>(null);
    const [response, setResponse] = useState("");
    const [code, setCode] = useState("");
    const [program, setProgram] = useState<IProgram | null>(null);
    const [editorWidth, setEditorWidth] = useState<number | undefined>(0);
    const [editorHeight, setEditorHeight] = useState<number | undefined>(400);

    const location = useLocation();
    const { problemID } = location.state;

    useEffect(() => {
        const getProgram = async () => {
            if (!loading) {
                let filteredPrograms = programs!.filter((p) => {
                    return p.problemID === problemID;
                });
    
                if (filteredPrograms.length === 0) {
                    let programID = await createProgram(problemID);
                    setProgram(programs!.filter((p) => {
                        return p.id === programID;
                    })[0]);
                } else {
                    setProgram(filteredPrograms[0])
                }
            }
        }

        getProgram();
    }, [loading])

    // useEffect(() => {
    //     const newSocket = io("http://10.0.219.34:3000");
    //     setSocket(newSocket);
    //     newSocket.on("result", (res) => {
    //         setResponse(res);
    //     })

    //     return function cleanup() {
    //         newSocket.close()
    //     }
    // }, []);

    function runCode() {
        socket.emit("work", code);
    }

    function onResize(w: number | undefined, h: number | undefined) {
        setEditorHeight(h);
        setEditorWidth(w);
    }

    function onChange(newValue: string) {
        setProgram({
            ...program!,
            code: newValue
        });
    }

    async function onSave() {
        await updateProgramCode(program!.id, program!.code);
    }

    if (program !== null) {
        return (
            <div>
                <div className="wrapper">
                    <div id="topbar">
                        <h2>SpeedCode</h2>
    
                        <div className="center">
                            <h3>Fast Primes</h3>
                            <p>Last saved three minutes ago.</p>
                        </div>
    
                        <button
                            className="mono" onClick={runCode}>
                            Run Code
                        </button>

                        <button onClick={onSave}>
                            Save Code
                        </button>
                    </div>
    
                    <div className="resizable">
                        <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
                        <AceEditor
                            height={editorHeight!.toString() + "px"}
                            width={"100vw"}
                            placeholder={problemID}
                            mode="python"
                            theme="monokai"
                            name="editor"
                            onChange={onChange}
                            fontSize={18}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={program && program.code}
                        />
                    </div>
    
                    <div id="console" style={{height: "calc(100vh - " + (editorHeight! + 100) + "px)",}}>
                        <h3>Console output:</h3>
                        <p>{response}</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}