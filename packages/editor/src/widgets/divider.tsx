"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerDividerWidget() {
  const widget: Widget = {
    type: "Divider",
    title: "Divider",
    category: "Basic",
    isContainer: false,

    fields: [
      { kind: "text",  label: "Margin", path: "style.margin", placeholder: "e.g. 24px 0" },
      { kind: "color", label: "Color",  path: "style.borderColor" },
      { kind: "text",  label: "Thickness", path: "style.borderWidth", placeholder: "e.g. 1px" },
    ],

    render: (node: Node) => {
      const color = node.style?.borderColor ?? "#e5e7eb";
      const borderWidth = node.style?.borderWidth ?? "1px";
      return (
        <hr
          style={{
            border: "none",
            borderTop: `${borderWidth} solid ${color}`,
            margin: node.style?.margin ?? "24px 0",
          }}
        />
      );
    },

    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Divider",
      props: {},
      style: {
        margin: "24px 0",
        borderColor: "#e5e7eb",
        borderWidth: "1px",
      },
      children: [],
    }),
  };

  registerWidget(widget);
}
