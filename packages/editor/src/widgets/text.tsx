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
      { kind: "textarea", label: "Text", path: "props.text", placeholder: "Type your copy...", rows: 5 },
      { kind: "color",    label: "Color", path: "style.color" },
      { kind: "text",     label: "Size",  path: "style.fontSize", placeholder: "e.g. 16px" },
      { kind: "text",     label: "Line Height", path: "style.lineHeight", placeholder: "e.g. 1.6" },
      { kind: "text",     label: "Margin", path: "style.margin", placeholder: "e.g. 0 0 16px" },
    ],

    render: (node: Node) => {
      return <p style={node.style}>{node.props?.text ?? "Your text goes here."}</p>;
    },

    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Text",
      props: {
        text:
          "This is a paragraph. Replace it with your copy.",
      },
      style: {
        fontSize: "16px",
        lineHeight: "1.6",
        margin: "0 0 16px",
      },
      children: [],
    }),
  };

  registerWidget(widget);
}
