"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Field } from "./registry";

export function registerSectionWidget() {
  registerWidget({
    type: "Section",
    title: "Section",
    category: "Layout",
    isContainer: true,
    acceptsChildTypes: ["Column"],
    fields: [] as Field[],
    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Section",
      style: { padding: "24px", border: "1px solid #e5e7eb", borderRadius: "8px", margin: "8px 0" },
      children: []
    }),
    render: (node) => <div style={node.style}>{node.children}</div>
  });
}
