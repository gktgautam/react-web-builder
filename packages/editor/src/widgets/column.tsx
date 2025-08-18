"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Field } from "./registry";

export function registerColumnWidget() {
  registerWidget({
    type: "Column",
    title: "Column",
    category: "Layout",
    isContainer: true,
    fields: [] as Field[],
    allowedParentTypes: ["Section"],
    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Column",
      style: { padding: "12px", border: "1px dashed #d1d5db", borderRadius: "6px", margin: "6px 0" },
      children: []
    }),
    render: (node) => <div style={node.style}>{node.children}</div>
  });
}
