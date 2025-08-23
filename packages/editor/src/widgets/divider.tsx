// packages/editor/src/widgets/divider.tsx
"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerDividerWidget() {
  const widget: Widget = {
    type: "Divider",
    title: "Divider",
    category: "Basic",
    isContainer: false,
    render(node) {
      return <hr style={{ borderColor: "#e5e7eb" }} />;
    },
    defaultNode(): Node {
      return { id: nanoid(), type: "Divider", style: { margin: "16px 0" }, children: [] };
    },
  };
  registerWidget(widget);
}
