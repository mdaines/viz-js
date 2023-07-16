import ImageZoom from "./ImageZoom.jsx";

export default function Output({ result, zoom, imageZoomRef, onZoomChange, isValid }) {
  let content;

  if (result) {
    if (result.format == "svg-image") {
      content = <ImageZoom svg={result.output} zoom={zoom} onZoomChange={onZoomChange} ref={imageZoomRef} />;
    } else {
      content = <div className="raw">{result.output}</div>;
    }
  }

  return (
    <div className={"output" + (!isValid ? " invalid" : "")}>
      {content}
    </div>
  );
}
