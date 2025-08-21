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
          padding: "6px 8px",
          paddingLeft: 8 + depth * 12,
          cursor: "pointer",
          background: isSelected ? "#eff6ff" : "transparent"
        }}
      >
        {node.type} <span style={{ color: "#9ca3af" }}>({node.id.slice(0,6)})</span>
      </div>
      {kids.map((k) => <Row key={k.id} node={k} depth={depth + 1} />)}
    </>
  );
}

export function LayersPanel() {
  const root = useEditorStore((s) => s.page);
  return ( 
      <Row node={root} depth={0} /> 
  );
}
