"use client";

import { useState, useEffect, RefObject } from "react";

export function useCanvasDimensions(containerRef: RefObject<HTMLDivElement>) {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({
          width: Math.max(offsetWidth, 400),
          height: Math.max(offsetHeight, 300)
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }
    
    return () => {
        if (containerRef.current) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            resizeObserver.unobserve(containerRef.current);
        }
    };
  }, [containerRef]);

  return { dimensions };
}
