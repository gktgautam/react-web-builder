import React, { useState, useRef, useEffect } from "react";

type Bounds =
  | { top: number; left: number; right: number; bottom: number }
  | "parent"
  | "body";

interface DraggableResizableProps {
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  bounds?: Bounds;
  handle?: string; // e.g., ".header"
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  style?: React.CSSProperties;
}

type ResizeDir =
  | "right"
  | "left"
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const DraggableResizable: React.FC<DraggableResizableProps> = ({
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 300, height: 200 },
  bounds,
  handle,
  minWidth = 150,
  minHeight = 100,
  maxWidth = 1000,
  maxHeight = 800,
  style,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLElement | null>(null);

  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<ResizeDir | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(1);

  const posRef = useRef(position);
  const sizeRef = useRef(size);

  useEffect(() => {
    posRef.current = position;
  }, [position]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  const applyBounds = (x: number, y: number, w: number, h: number) => {
    if (!bounds || bounds === "body") {
      const maxX = window.innerWidth - w;
      const maxY = window.innerHeight - h;
      return { x: clamp(x, 0, maxX), y: clamp(y, 0, maxY) };
    }
    if (bounds === "parent" && nodeRef.current?.parentElement) {
      const parent = nodeRef.current.parentElement.getBoundingClientRect();
      return {
        x: clamp(x, 0, parent.width - w),
        y: clamp(y, 0, parent.height - h),
      };
    }
    if (typeof bounds === "object") {
      return {
        x: clamp(x, bounds.left, bounds.right - w),
        y: clamp(y, bounds.top, bounds.bottom - h),
      };
    }
    return { x, y };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (dragging) {
        const newPos = applyBounds(
          clientX - offset.x,
          clientY - offset.y,
          sizeRef.current.width,
          sizeRef.current.height
        );
        setPosition(newPos);
      }

      if (resizing) {
        let { width, height } = sizeRef.current;
        let { x, y } = posRef.current;

        if (resizing.includes("right")) {
          width = Math.min(
            Math.max(minWidth, clientX - x),
            maxWidth
          );
        }
        if (resizing.includes("left")) {
          const diff = clientX - x;
          width = Math.min(
            Math.max(minWidth, sizeRef.current.width - diff),
            maxWidth
          );
          x += diff;
        }
        if (resizing.includes("bottom")) {
          height = Math.min(
            Math.max(minHeight, clientY - y),
            maxHeight
          );
        }
        if (resizing.includes("top")) {
          const diff = clientY - y;
          height = Math.min(
            Math.max(minHeight, sizeRef.current.height - diff),
            maxHeight
          );
          y += diff;
        }

        const bounded = applyBounds(x, y, width, height);
        setSize({ width, height });
        setPosition(bounded);
      }
    };

    const onUp = () => {
      setDragging(false);
      setResizing(null);
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, resizing, offset, bounds, minWidth, minHeight, maxWidth, maxHeight]);

  useEffect(() => {
    if (handle && nodeRef.current) {
      handleRef.current = nodeRef.current.querySelector(handle);
    }
  }, [handle]);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (
      handleRef.current &&
      e.target !== handleRef.current &&
      !handleRef.current.contains(e.target as Node)
    ) {
      return;
    }
    setDragging(true);
    setZIndex(Date.now()); // bring to front
    const clientX = "touches" in e ? e.touches[0].clientX : (e as any).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as any).clientY;
    setOffset({ x: clientX - position.x, y: clientY - position.y });
    document.body.style.cursor = "grabbing";
  };

  const onResizeStart = (dir: ResizeDir) => (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setResizing(dir);
    setZIndex(Date.now());
    document.body.style.cursor = handleStyle(dir).cursor || "";
  };

  return (
    <div
      ref={nodeRef}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        userSelect: "none",
        zIndex,
        ...style,
      }}
    >
      {children}

      {/* Edges */}
      <div onMouseDown={onResizeStart("right")} onTouchStart={onResizeStart("right")} style={handleStyle("right")} />
      <div onMouseDown={onResizeStart("left")} onTouchStart={onResizeStart("left")} style={handleStyle("left")} />
      <div onMouseDown={onResizeStart("top")} onTouchStart={onResizeStart("top")} style={handleStyle("top")} />
      <div onMouseDown={onResizeStart("bottom")} onTouchStart={onResizeStart("bottom")} style={handleStyle("bottom")} />

      {/* Corners */}
      <div onMouseDown={onResizeStart("top-left")} onTouchStart={onResizeStart("top-left")} style={handleStyle("top-left")} />
      <div onMouseDown={onResizeStart("top-right")} onTouchStart={onResizeStart("top-right")} style={handleStyle("top-right")} />
      <div onMouseDown={onResizeStart("bottom-left")} onTouchStart={onResizeStart("bottom-left")} style={handleStyle("bottom-left")} />
      <div onMouseDown={onResizeStart("bottom-right")} onTouchStart={onResizeStart("bottom-right")} style={handleStyle("bottom-right")} />
    </div>
  );
};

// Styles for resize handles
const handleStyle = (dir: ResizeDir): React.CSSProperties => {
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: 10,
    background: "transparent",
  };

  const size = 10;

  switch (dir) {
    case "right":
      return { ...base, top: 0, right: 0, width: size, height: "100%", cursor: "ew-resize" };
    case "left":
      return { ...base, top: 0, left: 0, width: size, height: "100%", cursor: "ew-resize" };
    case "top":
      return { ...base, top: 0, left: 0, width: "100%", height: size, cursor: "ns-resize" };
    case "bottom":
      return { ...base, bottom: 0, left: 0, width: "100%", height: size, cursor: "ns-resize" };
    case "top-left":
      return { ...base, top: 0, left: 0, width: size, height: size, cursor: "nwse-resize" };
    case "top-right":
      return { ...base, top: 0, right: 0, width: size, height: size, cursor: "nesw-resize" };
    case "bottom-left":
      return { ...base, bottom: 0, left: 0, width: size, height: size, cursor: "nesw-resize" };
    case "bottom-right":
      return { ...base, bottom: 0, right: 0, width: size, height: size, cursor: "nwse-resize" };
    default:
      return base;
  }
};

export default DraggableResizable;
