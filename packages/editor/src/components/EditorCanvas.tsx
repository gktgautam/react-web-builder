// packages/editor/src/components/EditorCanvas.tsx
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
  const setHover   = useEditorStore((s) => s.hoverNode);

  const isSelected = selectedId === node.id;
  const isHovered  = hoveredId === node.id;

  const common: React.HTMLAttributes<HTMLDivElement> = {
    onClick: (e) => { e.stopPropagation(); selectNode(node.id); },
    onMouseEnter: () => setHover(node.id),
    onMouseLeave: () => setHover(null),
    style: {
      outline: isSelected ? "2px solid #3b82f6" : isHovered ? "1px dashed #60a5fa" : undefined,
      outlineOffset: 2,
      cursor: "default",
      ...(node.style || {}),
    },
  };

  if (node.type === "Page") {
    const kids = node.children ?? [];
    return (
      <div {...common}>
        {kids.map((k, i) => (
          <React.Fragment key={k.id}>
            <DropSlot parentId={node.id} index={i} />
            <RenderNode node={k} />
          </React.Fragment>
        ))}
        <DropSlot parentId={node.id} index={kids.length} />
      </div>
    );
  }

  const meta = getWidget(node.type);
  if (!meta) return <div {...common}>Unknown widget: {node.type}</div>;

  if (meta.isContainer) {
    const kids = node.children ?? [];
    return (
      <div {...common}>
        {kids.map((k, i) => (
          <React.Fragment key={k.id}>
            <DropSlot parentId={node.id} index={i} />
            <RenderNode node={k} />
          </React.Fragment>
        ))}
        <DropSlot parentId={node.id} index={kids.length} />
      </div>
    );
  }

  // leaf widget
  return <div {...common}>{meta.render(node)}</div>;
}

export function EditorCanvas() {
  const page = useEditorStore((s) => s.page);
  const bp = useEditorStore((s) => s.activeBreakpoint);

  const width = bp === "mobile" ? 420 : bp === "tablet" ? 768 : 1024;

  return (
    <main className="flex-1 col-span-3 overflow-auto bg-gray-100 p-4">
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
