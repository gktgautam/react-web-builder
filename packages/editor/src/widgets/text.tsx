// packages/editor/src/widgets/text.tsx
"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerTextWidget() {
  const widget: Widget = {
    type: "Text",
    title: "Text",
    category: "Basic",
    isContainer: false,
    fields: [
      { kind: "textarea", label: "Text", path: "props.text", placeholder: "Write something" },
    ],
    render(node) {
      const text = (node as any).props?.text ?? "This is a paragraph. Replace it with your copy.";
      return <p style={{ margin: 0 }}>{text}</p>;
    },
    defaultNode(): Node {
      return {
        id: nanoid(),
        type: "Text",
        props: { text: "This is a paragraph. Replace it with your copy." },
        style: { fontSize: "16px", lineHeight: "1.6", margin: "0 0 16px" },
        children: [],
      };
    },
  };
  registerWidget(widget);
}
