// packages/editor/src/widgets/column.tsx
"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerColumnWidget() {
  const widget: Widget = {
    type: "Columns",
    title: "Columns",
    category: "Layout",
    isContainer: true,
    fields: [
      { kind: "text", label: "Columns", path: "props.cols", placeholder: "2" },
      { kind: "text", label: "Gap",     path: "style.gap",  placeholder: "16px" },
    ],
    render(node) {
      const cols = Number((node as any).props?.cols ?? 2);
      const gap  = (node as any).style?.gap ?? "16px";
      const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap };
      return <div style={gridStyle}>{(node.children ?? []).map(() => null)}</div>;
    },
    defaultNode(): Node {
      return {
        id: nanoid(),
        type: "Columns",
        props: { cols: 2 },
        style: { gap: "16px" },
        children: [],
      };
    },
  };
  registerWidget(widget);
}
