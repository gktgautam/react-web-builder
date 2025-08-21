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
  const page = useEditorStore((s) => s.page);
  const viewport = useEditorStore((s) => s.activeBreakpoint);
  const width = viewport === "desktop" ? 1024 : viewport === "tablet" ? 768 : 375;

  return (
    <main className="flex-1 col-span-2 overflow-auto bg-gray-100 p-4">
      <div className="flex justify-between mb-3">
        <BreakpointSwitcher />
        <PreviewButton />
      </div>
      <div className="mx-auto" style={{ width }}>
        <div className="bg-white border border-gray-300 rounded-lg p-4 min-h-[70vh]">
          <RenderNode node={page} />
        </div>
      </div>
    </main>
  );
}
