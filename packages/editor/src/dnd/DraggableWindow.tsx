// packages/editor/src/dnd/DraggableWindow.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";

type Bounds = { top: number; left: number; right: number; bottom: number } | "parent" | "body";
type ResizeDir =
  | "left" | "right" | "top" | "bottom"
  | "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface DraggableResizableProps {
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  bounds?: Bounds;
  handle?: string; // CSS selector within children that starts the drag
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  style?: React.CSSProperties;
}

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const handleStyle = (dir: ResizeDir): React.CSSProperties => {
  const base: React.CSSProperties = { position: "absolute", zIndex: 10, background: "transparent" };
  const size = 10;
  switch (dir) {
    case "left":   return { ...base, left: 0, top: 0, bottom: 0, width: 6, cursor: "ew-resize" };
    case "right":  return { ...base, right: 0, top: 0, bottom: 0, width: 6, cursor: "ew-resize" };
    case "top":    return { ...base, top: 0, left: 0, right: 0, height: 6, cursor: "ns-resize" };
    case "bottom": return { ...base, bottom: 0, left: 0, right: 0, height: 6, cursor: "ns-resize" };
    case "top-left":     return { ...base, top: 0, left: 0, width: size, height: size, cursor: "nwse-resize" };
    case "top-right":    return { ...base, top: 0, right: 0, width: size, height: size, cursor: "nesw-resize" };
    case "bottom-left":  return { ...base, bottom: 0, left: 0, width: size, height: size, cursor: "nesw-resize" };
    case "bottom-right": return { ...base, bottom: 0, right: 0, width: size, height: size, cursor: "nwse-resize" };
    default: return base;
  }
};

const DraggableResizable: React.FC<DraggableResizableProps> = ({
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 300 },
  bounds = "body",
  handle,
  minWidth = 200,
  minHeight = 120,
  maxWidth = 1200,
  maxHeight = 900,
  style,
}) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<ResizeDir | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(50);

  // bounds calc
  const applyBounds = (x: number, y: number, w: number, h: number) => {
    if (bounds === "body") {
      const maxX = window.innerWidth - w;
      const maxY = window.innerHeight - h;
      return { x: clamp(x, 0, Math.max(0, maxX)), y: clamp(y, 0, Math.max(0, maxY)) };
    }
    if (bounds === "parent" && nodeRef.current?.parentElement) {
      const parent = nodeRef.current.parentElement.getBoundingClientRect();
      return {
        x: clamp(x, 0, Math.max(0, parent.width - w)),
        y: clamp(y, 0, Math.max(0, parent.height - h)),
      };
    }
    // numeric bounds
    if (bounds && bounds !== "body" && bounds !== "parent") {
      return {
        x: clamp(x, bounds.left, bounds.right - w),
        y: clamp(y, bounds.top, bounds.bottom - h),
      };
    }
    return { x, y };
  };

  // mousedown / touchstart for drag
  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    const dragTarget = handle ? (el.querySelector(handle) as HTMLElement | null) : el;
    if (!dragTarget) return;

    const start = (clientX: number, clientY: number) => {
      setDragging(true);
      setZIndex((z) => z + 1);
      setDragOffset({ x: clientX - position.x, y: clientY - position.y });
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      start(e.clientX, e.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return;
      start(t.clientX, t.clientY);
    };

    dragTarget.addEventListener("mousedown", onMouseDown);
    dragTarget.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      dragTarget.removeEventListener("mousedown", onMouseDown);
      dragTarget.removeEventListener("touchstart", onTouchStart);
    };
  }, [handle, position.x, position.y]);

  useEffect(() => {
    if (!dragging && !resizing) return;

    const onMove = (clientX: number, clientY: number) => {
      if (dragging) {
        const x = clientX - dragOffset.x;
        const y = clientY - dragOffset.y;
        setPosition((pos) => applyBounds(x, y, size.width, size.height));
      } else if (resizing) {
        setSize((sz) => {
          let { width, height } = sz;
          let { x, y } = position;

          if (resizing.includes("right"))   width  = Math.min(Math.max(minWidth, clientX - x), maxWidth);
          if (resizing.includes("left"))  { const diff = clientX - x; width = Math.min(Math.max(minWidth, sz.width - diff), maxWidth); x += diff; }
          if (resizing.includes("bottom"))  height = Math.min(Math.max(minHeight, clientY - y), maxHeight);
          if (resizing.includes("top"))   { const diff = clientY - y; height = Math.min(Math.max(minHeight, sz.height - diff), maxHeight); y += diff; }

          // apply bounds to new x/y
          const bounded = applyBounds(x, y, width, height);
          setPosition(bounded);
          return { width, height };
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => { const t = e.touches[0]; if (t) onMove(t.clientX, t.clientY); };

    const stop = () => { setDragging(false); setResizing(null); };
    const onMouseUp = stop;
    const onTouchEnd = stop;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, resizing, dragOffset.x, dragOffset.y, minWidth, minHeight, maxWidth, maxHeight, position, size]);

  const onResizeStart = (dir: ResizeDir) => (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setResizing(dir);
  };

  return (
    <div
      ref={nodeRef}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        userSelect: "none",
        zIndex,
        ...style,
      }}
      onMouseDown={() => setZIndex((z) => z + 1)}
    >
      {/* resize edges & corners */}
      <div onMouseDown={onResizeStart("right")}  style={handleStyle("right")} />
      <div onMouseDown={onResizeStart("left")}   style={handleStyle("left")} />
      <div onMouseDown={onResizeStart("top")}    style={handleStyle("top")} />
      <div onMouseDown={onResizeStart("bottom")} style={handleStyle("bottom")} />

      <div onMouseDown={onResizeStart("top-left")}     style={handleStyle("top-left")} />
      <div onMouseDown={onResizeStart("top-right")}    style={handleStyle("top-right")} />
      <div onMouseDown={onResizeStart("bottom-left")}  style={handleStyle("bottom-left")} />
      <div onMouseDown={onResizeStart("bottom-right")} style={handleStyle("bottom-right")} />

      {/* content - dragging is started by 'handle' selector if provided */}
      <div className={handle ? handle.replace(/^[.#]/, "") : undefined}>
        {children}
      </div>
    </div>
  );
};

export default DraggableResizable;
