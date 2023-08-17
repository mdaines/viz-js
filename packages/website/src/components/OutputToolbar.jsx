import { formats, engines } from "@viz-js/viz";
import { zoomLevels } from "./ImageZoom.jsx";

export default function OutputToolbar({ options, onOptionChange, zoomEnabled, zoom, onZoomChange, onZoomIn, onZoomOut }) {
  return (
    <div className="toolbar output-toolbar">
      <div className="toolbar-item">
        <select id="toolbar-engine" value={options.engine} onChange={e => onOptionChange("engine", e.target.value)}>
          {engines.map(value => <option key={value}>{value}</option>)}
        </select>
        <label htmlFor="toolbar-engine">Layout Engine</label>
      </div>

      <div className="toolbar-item">
        <select id="toolbar-format" value={options.format} onChange={e => onOptionChange("format", e.target.value)}>
          <option value="svg-image">{"SVG Image"}</option>
          <optgroup label="Raw output">
            {formats.map(value => <option key={value}>{value}</option>)}
          </optgroup>
        </select>
        <label htmlFor="toolbar-format">Output Format</label>
      </div>

      <div className="toolbar-item">
        <div className="toolbar-item-group">
          <select id="toolbar-zoom" value={zoom} onChange={e => onZoomChange(e.target.value)} disabled={!zoomEnabled}>
            <option value="fit">Fit</option>
            <optgroup label="Zoom Level">
              {zoomLevels.map((l, i) => <option key={i} value={l}>{Math.floor(l * 100) + "%"}</option>)}
            </optgroup>
          </select>

          <button onClick={onZoomOut} disabled={!zoomEnabled} aria-label="Zoom Out">{"−"}</button>
          <button onClick={onZoomIn} disabled={!zoomEnabled} aria-label="Zoom In">{"+"}</button>
        </div>
        <label htmlFor="toolbar-zoom">Zoom</label>
      </div>
    </div>
  );
}
