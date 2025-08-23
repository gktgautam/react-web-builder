// packages/editor/src/widgets/section.tsx
"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerSectionWidget() {
  const widget: Widget = {
    type: "Section",
    title: "Section",
    category: "Layout",
    isContainer: true,
    fields: [
      { kind: "text", label: "Padding", path: "style.padding", placeholder: "e.g. 32px 0" },
      { kind: "color", label: "Background", path: "style.background" },
    ],
    render(node) {
      const style = { padding: "32px 0", ...(node as any).style };
      return <section style={style}>{(node.children ?? []).map(() => null)}</section>;
    },
    defaultNode(): Node {
      return {
        id: nanoid(),
        type: "Section",
        props: {},
        style: { padding: "32px 0" },
        children: [],
      };
    },
  };
  registerWidget(widget);
}
