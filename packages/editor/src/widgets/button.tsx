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
      { kind: "text", label: "Padding", path: "style.padding", placeholder: "e.g. 10px 16px" },
      { kind: "color", label: "Text Color", path: "style.color" },
      { kind: "color", label: "Background", path: "style.background" },
      { kind: "text",  label: "Border Radius", path: "style.borderRadius", placeholder: "e.g. 8px" },
    ],

    render: (node: Node) => {
      const href = node.props?.href ?? "#";
      return (
        <a
          href={href}
          style={{
            display: "inline-block",
            textDecoration: "none",
            ...(node.style ?? {}),
          }}
        >
          {node.props?.label ?? "Button"}
        </a>
      );
    },

    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Button",
      props: { label: "Get Started", href: "#" },
      style: {
        color: "#ffffff",
        background: "#111827",
        padding: "10px 16px",
        borderRadius: "8px",
      },
      children: [],
    }),
  };

  registerWidget(widget);
}
