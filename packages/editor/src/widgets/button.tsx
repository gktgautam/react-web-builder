"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Field } from "./registry";

export function registerButtonWidget() {
  registerWidget({
    type: "Button",
    title: "Button",
    category: "Basic",
    fields: [
      { kind: "text", label: "Label", path: "props.label", placeholder: "Click me" },
      { kind: "url",  label: "Href",  path: "props.href",  placeholder: "https://…" }
    ] as Field[],
    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Button",
      props: { label: "Click me", href: "#" },
      style: { display: "inline-block", background: "#111827", color: "#fff", padding: "10px 14px", borderRadius: "8px", textDecoration: "none" }
    }),
    render: (node) => {
      const href = node.props?.href ?? "#";
      const label = node.props?.label ?? "Button";
      return <a href={href} style={node.style}>{label}</a>;
    }
  });
}
