// packages/editor/src/palette/WidgetPalette.tsx
"use client";
import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { widgetsByCategory } from "../widgets/registry";
import type { Node } from "../schema";
import { useEditorStore } from "../store/createEditorStore";
import { nanoid } from "nanoid";
import { registerDefaultWidgets } from "../widgets";

// --- ensure registry populated exactly once, synchronously ---
let __widgets_bootstrapped = false;
function ensureWidgetsRegisteredOnce() {
  if (!__widgets_bootstrapped) {
    registerDefaultWidgets();
    __widgets_bootstrapped = true;
  }
}

function DraggableWidget({
  type,
  title,
  onAdd,
}: {
  type: string;
  title: string;
  onAdd: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${type}`,
    data: { kind: "widget", widgetType: type },
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={onAdd}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        padding: "8px 10px",
        background: isDragging ? "#f3f4f6" : "#fff",
        cursor: "grab",
      }}
      title={`Add ${title}`}
    >
      <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
    </button>
  );
}

export function WidgetPalette({ parentId }: { parentId: string }) {
  // Make sure registry is ready before we read it
  ensureWidgetsRegisteredOnce();

  // Read registry AFTER bootstrapping
  const groups = widgetsByCategory();

  // Use the action that actually exists in your store
  const insertNode = useEditorStore((s) => s.insertNode);

  const clickAdd = (def: () => Node) => {
    const node = def();
    insertNode(parentId, { ...node, id: node.id ?? nanoid() });
  };

  return (
    <aside
      style={{
        width: 260,
        borderRight: "1px solid #e5e7eb",
        background: "#fff",
        padding: 12,
        overflow: "auto",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Widgets</div>

      {Object.entries(groups).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{cat}</div>

          {items.length === 0 ? (
            <div style={{ fontSize: 12, color: "#9ca3af" }}>No widgets</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {items.map((w) => (
                <DraggableWidget
                  key={w.type}
                  type={w.type}
                  title={w.title}
                  onAdd={() => clickAdd(w.defaultNode)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
