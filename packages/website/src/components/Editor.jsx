import { useRef, useEffect, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { linter } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";
import { dot as dotLanguageSupport } from "@viz-js/lang-dot";
import Errors from "./Errors.jsx";

const syntaxLinter = linter((view) => {
  let diagnostics = [];

  syntaxTree(view.state).cursor().iterate((node) => {
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

export default function Editor({ defaultValue = "", onChange }) {
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

  return (
    <div className="editor" ref={editorContainerRef}></div>
  );
}
