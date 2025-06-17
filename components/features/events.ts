"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

import { DefaultType } from "@/types";

// Maximum zoom limit
const ZOOM_SCALE_SVG_MAXIMUM = 1.25; // 125%
const ZOOM_SCALE_SVG_MINIMUM = 0.5; // Optional minimum zoom

export const PreventZoomEvent = () => {
  const resetD3ZoomRef = useRef<(() => void) | null>(null); // Store reset function

  useEffect(() => {
    if (typeof window === "undefined") return;

    // **Prevent Browser Zoom**
    const preventZoom = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault(); // Prevent Ctrl + Scroll zoom
      }
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "0") {
        event.preventDefault(); // Reset zoom on Ctrl + 0
        document.body.style.transform = ""; // Reset page zoom
        resetD3ZoomRef.current?.(); // Reset D3 zoom if available
      } else if (event.ctrlKey && (event.key === "+" || event.key === "-")) {
        event.preventDefault(); // Prevent Ctrl + + and Ctrl + -
      }
    };

    const preventPinchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault(); // Prevent pinch zoom on mobile
      }
    };

    // Return early if window is undefined
    if (typeof window === "undefined") return;

    // Add event listeners for browser zoom prevention
    window.addEventListener("wheel", preventZoom, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    document.addEventListener("gesturestart", (event) =>
      event.preventDefault(),
    ); // Prevent pinch zoom in Safari

    document.addEventListener("touchmove", preventPinchZoom, {
      passive: false,
    });

    return () => {
      // Return early if window is undefined
      if (typeof window === "undefined") return;

      // Remove event listeners
      window.removeEventListener("wheel", preventZoom);
      window.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("gesturestart", (event) =>
        event.preventDefault(),
      );
      document.removeEventListener("touchmove", preventPinchZoom);
    };
  }, []);

  useEffect(() => {
    // 2️⃣ **Handle D3 Zoom with Limits**
    const svg = d3.select("svg"); // Select your SVG element
    const zoomBehavior: DefaultType = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([ZOOM_SCALE_SVG_MINIMUM, ZOOM_SCALE_SVG_MAXIMUM]) // Enforce min/max zoom
      .on("zoom", (event) => {
        svg.attr("transform", event.transform.toString()); // Apply D3 zoom
      });

    svg.call(zoomBehavior); // Attach zoom behavior to the SVG

    // Function to reset D3 zoom
    const resetD3Zoom = () => {
      svg
        .transition()
        .duration(300)
        .call(zoomBehavior.transform, d3.zoomIdentity);
    };

    // Store reset function in ref (so `Ctrl + 0` can access it)
    resetD3ZoomRef.current = resetD3Zoom;

    return () => {
      svg.on(".zoom", null); // Remove zoom on cleanup
    };
  }, []);

  return null;
};
