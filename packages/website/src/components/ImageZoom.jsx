import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as imageZoomClasses from "./ImageZoom.module.css";

export const zoomLevels = [
  0.05, 0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4
];

function updateZoom(container, image, dimensions, zoom) {
  if (zoom == "fit") {
    container.classList.add(imageZoomClasses.fit);

    image.width = dimensions.width;
    image.height = dimensions.height;
  } else {
    container.classList.remove(imageZoomClasses.fit);

    image.width = dimensions.width * zoom;
    image.height = dimensions.height * zoom;
  }
}

function adjustScroll(container, fn) {
  const ratioX = (container.scrollLeft + container.clientWidth / 2) / container.scrollWidth;
  const ratioY = (container.scrollTop + container.clientHeight / 2) / container.scrollHeight;

  fn();

  container.scrollLeft = (ratioX * container.scrollWidth) - (container.clientWidth / 2);
  container.scrollTop = (ratioY * container.scrollHeight) - (container.clientHeight / 2);
}

function measureFitZoomLevel(container, dimensions) {
  if (dimensions.width < container.offsetWidth && dimensions.height < container.offsetHeight) {
    return 1;
  }

  const widthRatio = container.offsetWidth / dimensions.width;
  const heightRatio = container.offsetHeight / dimensions.height;

  return Math.min(widthRatio, heightRatio);
}

const ImageZoom = forwardRef(function ImageZoom({ svg, zoom, onZoomChange }, ref) {
  const blobURLRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const dimensionsRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      zoomIn() {
        if (!containerRef.current) {
          return;
        }

        if (!dimensionsRef.current) {
          return;
        }

        const effectiveZoomLevel = zoom == "fit" ? measureFitZoomLevel(containerRef.current, dimensionsRef.current) : zoom;
        const index = Math.min(zoomLevels.length - 1, zoomLevels.findLastIndex(level => level <= effectiveZoomLevel) + 1);

        onZoomChange(zoomLevels[index]);
      },

      zoomOut() {
        if (!containerRef.current) {
          return;
        }

        if (!dimensionsRef.current) {
          return;
        }

        const effectiveZoomLevel = zoom == "fit" ? measureFitZoomLevel(containerRef.current, dimensionsRef.current) : zoom;
        const index = Math.max(0, zoomLevels.findIndex(level => level >= effectiveZoomLevel) - 1);

        onZoomChange(zoomLevels[index]);
      }
    }
  });

  useEffect(() => {
    if (!imageRef.current) {
      return;
    }

    if (!dimensionsRef.current) {
      return;
    }

    adjustScroll(containerRef.current, () => {
      updateZoom(containerRef.current, imageRef.current, dimensionsRef.current, zoom);
    });
  }, [zoom]);

  useEffect(() => {
    let ignore = false;

    const image = new Image();

    image.addEventListener("load", function() {
      if (ignore) {
        return;
      }

      dimensionsRef.current = { width: image.width, height: image.height };

      imageRef.current = image;

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(imageRef.current);

      updateZoom(containerRef.current, imageRef.current, dimensionsRef.current, zoom);
    });

    if (blobURLRef.current) {
      URL.revokeObjectURL(blobURLRef.current);
      blobURLRef.current = null;
    }

    const blob = new Blob([svg], { type: "image/svg+xml" });
    blobURLRef.current = URL.createObjectURL(blob);

    image.src = blobURLRef.current;

    return () => {
      ignore = true;

      if (blobURLRef.current) {
        URL.revokeObjectURL(blobURLRef.current);
        blobURLRef.current = null;
      }
    };
  }, [svg]);

  return (
    <div className={imageZoomClasses.container} ref={containerRef}>
    </div>
  );
});

export default ImageZoom;
