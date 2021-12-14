import AceEditor from "react-ace";
import ReactResizeDetector from "react-resize-detector";
import React from "react";

import "./Editor.css";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

interface IEditorState {
    editorHeight: any;
    editorWidth: any;
    code: string;
    response: string;
}

export default class Editor extends React.Component<any, IEditorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      editorHeight: 400,
      editorWidth: "100vw",
      code: "",
      response: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  onResize(w: number | undefined, h: number | undefined) {
    this.setState({
      editorHeight: h,
      editorWidth: w,
    });
  }

  onChange(newValue: string) {
    this.setState({ code: newValue });
    // console.log(newValue);
  }

  runCode() {
    fetch(
      "http://10.0.219.34:3000?" +
        new URLSearchParams({
          code: this.state.code,
        })
    )
      .then((response) => response.text())
      .then((response) => {
        this.setState({ response: response });
      });
  }

  render() {
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
            className="mono"
            onClick={() => {
              this.runCode();
            }}
          >
            Run code
          </button>
        </div>

          <div className="resizable">
            <ReactResizeDetector
              handleWidth
              handleHeight
              onResize={this.onResize}
            />
            <AceEditor
              height={this.state.editorHeight}
              width={this.state.editorWidth}
              placeholder="Write code here."
              mode="python"
              theme="monokai"
              name="editor"
              onChange={this.onChange}
              fontSize={18}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              
            />
          </div>

          <div id="console" style={{"height": "calc(100vh - " + (this.state.editorHeight + 100) + "px)"}}>
            <h3>Console Output:</h3>
            <p>{this.state.response}</p>
          </div>
        </div>
      </div>
    );
  }
}