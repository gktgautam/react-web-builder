// packages/editor/src/widgets/button.tsx
"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerButtonWidget() {
  const widget: Widget = {
    type: "Button",
    title: "Button",
    category: "Basic",
    isContainer: false,
    fields: [
      { kind: "text", label: "Label", path: "props.label", placeholder: "e.g. Get Started" },
      { kind: "url",  label: "URL",   path: "props.href",  placeholder: "https://..." },
    ],
    render(node) {
      const label = (node as any).props?.label ?? "Button";
      const href  = (node as any).props?.href ?? "#";
      return <a href={href} style={{ padding: "8px 12px", background: "#111827", color: "#fff", borderRadius: 8 }}>{label}</a>;
    },
    defaultNode(): Node {
      return {
        id: nanoid(),
        type: "Button",
        props: { label: "Get Started", href: "#" },
        style: { display: "inline-block" },
        children: [],
      };
    },
  };
  registerWidget(widget);
}
