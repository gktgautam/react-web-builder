// packages/editor/src/widgets/heading.tsx
"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerHeadingWidget() {
  const widget: Widget = {
    type: "Heading",
    title: "Heading",
    category: "Basic",
    isContainer: false,
    fields: [
      { kind: "text",   label: "Text", path: "props.text", placeholder: "Your headline" },
      { kind: "select", label: "Tag",  path: "props.tag",  options: [
        { label: "h1", value: "h1" },
        { label: "h2", value: "h2" },
        { label: "h3", value: "h3" },
        { label: "h4", value: "h4" },
      ]},
    ],
    render(node) {
      const Tag = ((node as any).props?.tag ?? "h2") as any;
      const text = (node as any).props?.text ?? "Heading";
      return <Tag style={{ margin: 0 }}>{text}</Tag>;
    },
    defaultNode(): Node {
      return {
        id: nanoid(),
        type: "Heading",
        props: { text: "Your headline", tag: "h2" },
        style: { fontSize: "32px", fontWeight: "700", margin: "0 0 8px" },
        children: [],
      };
    },
  };
  registerWidget(widget);
}
