import { useState, useEffect, useMemo, useRef } from "react";
import { throttle } from "lodash-es";
import ReloadablePromiseWorker, { TerminatedError } from "../reloadable-promise-worker.js";
import Editor from "./Editor.jsx";
import Toolbar from "./Toolbar.jsx";
import Output from "./Output.jsx";
import Errors from "./Errors.jsx";

const EXAMPLE = `digraph {
  a -> b
}
`;

const worker = new ReloadablePromiseWorker(() => new Worker(new URL("../worker.js", import.meta.url), { type: "module" }));

function render(src, options) {
  let effectiveFormat = options.format == "svg-image" ? "svg" : options.format;

  return worker
    .postMessage({ src, options: { ...options, format: effectiveFormat } })
    .then(result => {
      return { ...result, format: options.format };
    });
}

export default function App() {
  const [src, setSrc] = useState(EXAMPLE);
  const [options, setOptions] = useState({ engine: "dot", format: "svg-image" });
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [zoom, setZoom] = useState("fit");
  const [isValid, setValid] = useState(false);
  const imageZoomRef = useRef(null);

  const handleSrcChange = useMemo(() => {
    return throttle(setSrc, 500);
  }, [setSrc]);

  const handleOptionChange = useMemo(() => {
    return (k, v) => setOptions(o => ({ ...o, [k]: v }));
  }, [setOptions]);

  useEffect(() => {
    let ignore = false;

    setValid(false);

    render(src, options)
      .then(nextResult => {
        if (ignore) {
          return;
        }

        if (nextResult.status == "success") {
          setResult(nextResult);
          setValid(true);
        }

        setErrors(nextResult.errors);
      })
      .catch(error => {
        if (!(error instanceof TerminatedError)) {
          setErrors([
            { level: "error", message: error.toString() }
          ]);
        }
      });

    return () => {
      ignore = true;
    };
  }, [src, options]);

  const zoomEnabled = result?.format == "svg-image";

  return (
    <>
      <Editor defaultValue={src} onChange={handleSrcChange} errors={errors} />
      <Toolbar options={options} onOptionChange={handleOptionChange} zoomEnabled={zoomEnabled} zoom={zoom} onZoomChange={setZoom} onZoomIn={() => imageZoomRef.current?.zoomIn()} onZoomOut={() => imageZoomRef.current?.zoomOut()} />
      <Output result={result} zoom={zoom} imageZoomRef={imageZoomRef} onZoomChange={setZoom} isValid={isValid} />
      <Errors errors={errors} />
    </>
  );
}
