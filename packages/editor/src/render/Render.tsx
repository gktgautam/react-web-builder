"use client";
import * as React from "react";
import type { Node } from "../schema";
import { getWidget } from "../widgets/registry";

function RenderNode({ node }: { node: Node }) {
  if (node.type === "Page") {
    const kids = node.children ?? [];
    return <div style={node.style}>{kids.map((k) => <RenderNode key={k.id} node={k} />)}</div>;
  }
  const meta = getWidget(node.type);
  if (!meta) return null;

  if (meta.isContainer) {
    const kids = node.children ?? [];
    return (
      <div style={node.style}>
        {kids.map((k) => <RenderNode key={k.id} node={k} />)}
      </div>
    );
  }
  return <>{meta.render(node)}</>;
}

export function Render({ doc }: { doc: { tree: Node } }) {
  return <RenderNode node={doc.tree} />;
}
