"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget } from "./registry";

export function registerDividerWidget() {
  registerWidget({
    type: "Divider",
    title: "Divider",
    category: "Basic",
    fields: [],
    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Divider",
      style: { margin: "12px 0", border: "0", borderTop: "1px solid #e5e7eb" }
    }),
    render: (node) => <hr style={node.style as any} />
  });
}
