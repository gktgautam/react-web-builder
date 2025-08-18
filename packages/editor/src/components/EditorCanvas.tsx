"use client";
import * as React from "react";
import { useEditorStore } from "../store/createEditorStore";
import { getWidget } from "../widgets/registry";
import type { Node } from "../schema";
import { DropSlot } from "./DropSlot";
import { BreakpointSwitcher } from "./core/BreakpointSwitcher";
import { PreviewButton } from "./core/PreviewButton";

function RenderNode({ node }: { node: Node }) {
  const hoveredId  = useEditorStore((s) => s.hoveredId);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectNode = useEditorStore((s) => s.selectNode);

  if (node.type === "Page") {
    const kids = node.children ?? [];
    return (
      <div onClick={() => selectNode(node.id)}>
        {kids.map((c, i) => (
          <React.Fragment key={c.id}>
            <DropSlot parentId={node.id} index={i} />
            <RenderNode node={c} />
          </React.Fragment>
        ))}
        <DropSlot parentId={node.id} index={kids.length} />
      </div>
    );
  }

  const meta = getWidget(node.type);
  if (!meta) return null;

  const border =
    node.id === selectedId
      ? "2px solid #3b82f6"
      : node.id === hoveredId
      ? "1px solid #f59e0b"
      : "1px solid transparent";

  const kids = node.children ?? [];
  return (
    <div
      style={{ position: "relative", border, borderRadius: 8, padding: 4 }}
      onMouseEnter={() => useEditorStore.getState().hoverNode(node.id)}
      onMouseLeave={() => useEditorStore.getState().hoverNode(null)}
      onClick={(e) => { e.stopPropagation(); selectNode(node.id); }}
    >
      {meta.render({
        ...node,
        children: meta.isContainer ? kids.map(k => <RenderNode key={k.id} node={k} />) as any : undefined
      })}
      {meta.isContainer && (
        <>
          {kids.map((child, i) => (
            <React.Fragment key={child.id}>
              <DropSlot parentId={node.id} index={i} />
              <RenderNode node={child} />
            </React.Fragment>
          ))}
          <DropSlot parentId={node.id} index={kids.length} />
        </>
      )}
    </div>
  );
}

export function EditorCanvas() {
  const page = useEditorStore((s) => s.doc.tree);
  const viewport = useEditorStore((s) => s.activeBreakpoint);
  const width =
    viewport === "desktop" ? 1024 : viewport === "tablet" ? 768 : 375;

  return (
    <main style={{ flex: 1, overflow: "auto", background: "#f9fafb", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <BreakpointSwitcher />
        <PreviewButton />
      </div>
      <div style={{ width, margin: "0 auto" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, minHeight: "70vh" }}>
          <RenderNode node={page} />
        </div>
      </div>
    </main>
  );
}
