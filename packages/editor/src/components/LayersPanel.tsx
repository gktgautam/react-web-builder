// packages/editor/src/components/LayersPanel.tsx
"use client";
import * as React from "react";
import { useEditorStore } from "../store/createEditorStore";
import type { Node } from "../schema";

function Row({ node, depth }: { node: Node; depth: number }) {
  const select = useEditorStore((s) => s.selectNode);
  const selected = useEditorStore((s) => s.selectedId);
  const kids = node.children ?? [];
  const isSelected = selected === node.id;

  return (
    <>
      <div
        onClick={() => select(node.id)}
        style={{
          padding: "6px 10px",
          background: isSelected ? "#111827" : "transparent",
          color: isSelected ? "#fff" : "#111827",
          borderBottom: "1px solid #e5e7eb",
          cursor: "pointer",
          paddingLeft: 10 + depth * 12,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
          fontSize: 12,
        }}
      >
        {node.type} <span style={{ color: isSelected ? "#e5e7eb" : "#9ca3af" }}>({node.id.slice(0,6)})</span>
      </div>
      {kids.map((k) => <Row key={k.id} node={k} depth={depth + 1} />)}
    </>
  );
}

export function LayersPanel() {
  const root = useEditorStore((s) => s.page);
  return <div style={{ minWidth: 240 }}><Row node={root} depth={0} /></div>;
}
