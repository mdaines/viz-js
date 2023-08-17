import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { linter } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { dot as dotLanguageSupport } from "@viz-js/lang-dot";
import Errors from "./Errors.jsx";

const syntaxLinter = linter((view) => {
  let diagnostics = [];
  let graphtype;

  syntaxTree(view.state).cursor().iterate(node => {
    if (!graphtype && node.matchContext(["Graphtype"])) {
      graphtype = node.name;
    }

    if (node.type.is("--") && graphtype == "digraph") {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: "error",
        message: "Syntax error: undirected edge in directed graph",
        actions: [
          {
            name: "Replace with directed edge",
            apply(view, from, to) {
              view.dispatch({ changes: { from, to, insert: "->" }});
            }
          }
        ]
      });
    }

    if (node.type.is("->") && graphtype == "graph") {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: "error",
        message: "Syntax error: directed edge in undirected graph",
        actions: [
          {
            name: "Replace with undirected edge",
            apply(view, from, to) {
              view.dispatch({ changes: { from, to, insert: "--" }});
            }
          }
        ]
      });
    }

    if (node.type.isError) {
      diagnostics.push({
        from: node.from,
        to: node.to,
        severity: "error",
        message: "Syntax error"
      });
    }
  });

  return diagnostics;
});

const Editor = forwardRef(function Editor({ defaultValue = "", onChange }, ref) {
  let editorContainerRef = useRef(null);
  let editorViewRef = useRef(null);

  useEffect(() => {
    if (!editorViewRef.current) {
      let updateListener = EditorView.updateListener.of(function(update) {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      });

      let state = EditorState.create({
        doc: defaultValue,
        extensions: [
          basicSetup,
          dotLanguageSupport(),
          syntaxLinter,
          updateListener,
          EditorView.lineWrapping
        ]
      });

      editorViewRef.current = new EditorView({
        state,
        parent: editorContainerRef.current
      });
    }

    return () => {
      editorViewRef.current.destroy();
      editorViewRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => {
    return {
      setValue(value) {
        let view = editorViewRef.current;

        if (view) {
          view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: value }
          });
        }
      }
    }
  });

  return (
    <div className="editor" ref={editorContainerRef}></div>
  );
});

export default Editor;
