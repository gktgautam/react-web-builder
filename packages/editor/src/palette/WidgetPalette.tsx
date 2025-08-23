// packages/editor/src/palette/WidgetPalette.tsx
"use client";
import * as React from "react";
import { useDraggable } from "@dnd-kit/core";
import { widgetsByCategory } from "../widgets/registry";
import { useEditorStore } from "../store/createEditorStore";
import type { Node } from "../schema";

function DraggableWidget({ type, title, onAdd }: { type: string; title: string; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `widget:${type}`,
    data: { kind: "widget", widgetType: type },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        padding: "8px 10px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: isDragging ? "#f3f4f6" : "#fff",
        cursor: "grab",
      }}
      className="flex items-center justify-between mb-2 select-none"
    >
      <span>{title}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
        className="text-sm px-2 py-1 border rounded"
        title="Add"
      >
        +
      </button>
    </div>
  );
}

export function WidgetPalette() {
  const addChild = useEditorStore((s) => s.addChild);
  const page = useEditorStore((s) => s.page);

  const clickAdd = (factory: () => Node) => {
    const rootId = page.id;
    addChild(rootId, factory());
  };

  const groups = widgetsByCategory();

  return (
    <div>
      {(Object.entries(groups)).map(([cat, widgets]) => (
        <div key={cat} className="mb-4">
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{cat}</div>
          <div>
            {widgets.map((w) => (
              <DraggableWidget key={w.type} type={w.type} title={w.title} onAdd={() => clickAdd(w.defaultNode)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
