"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Field } from "./registry";

export function registerTextWidget() {
  registerWidget({
    type: "Text",
    title: "Text",
    category: "Basic",
    fields: [
      { kind: "textarea", label: "Text", path: "props.text", rows: 4, placeholder: "Type something…" }
    ] as Field[],
    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Text",
      props: { text: "Lorem ipsum dolor sit amet." },
      style: { margin: "6px 0", color: "#111827" }
    }),
    render: (node) => <p style={node.style}>{node.props?.text ?? ""}</p>
  });
}
