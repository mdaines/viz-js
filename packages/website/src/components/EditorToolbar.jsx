import { useState } from "react";
import { getExampleNames, defaultExampleName, getExample } from "../examples.js";

export default function EditorToolbar({ onLoadExample, onCopyLink }) {
  const [exampleName, setExampleName] = useState(defaultExampleName);

  function handleLoadExample() {
    onLoadExample(getExample(exampleName));
  }

  return (
    <div className="toolbar editor-toolbar">
      <div className="toolbar-item">
        <div className="toolbar-item-group">
          <select id="toolbar-examples" value={exampleName} onChange={e => setExampleName(e.target.value)}>
            {getExampleNames().map(value => <option key={value}>{value}</option>)}
          </select>
          <button onClick={handleLoadExample}>{"Load"}</button>
        </div>
        <label htmlFor="toolbar-examples">Example Graphs</label>
      </div>

      <div className="toolbar-flexible-space">
      </div>

      <div className="toolbar-item">
        <button onClick={onCopyLink}>{"Copy Link"}</button>
      </div>
    </div>
  );
}
