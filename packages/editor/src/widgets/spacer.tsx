// packages/editor/src/widgets/spacer.tsx
"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerSpacerWidget() {
  const widget: Widget = {
    type: "Spacer",
    title: "Spacer",
    category: "Basic",
    isContainer: false,
    fields: [{ kind: "text", label: "Height", path: "style.height", placeholder: "e.g. 24px" }],
    render(node) {
      const h = (node as any).style?.height ?? "24px";
      return <div style={{ height: h }} />;
    },
    defaultNode(): Node {
      return { id: nanoid(), type: "Spacer", style: { height: "24px" }, children: [] };
    },
  };
  registerWidget(widget);
}
