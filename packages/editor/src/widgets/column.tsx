"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerColumnWidget() {
  const widget: Widget = {
    type: "Column",
    title: "Column",
    category: "Layout",
    isContainer: true,
    allowedParentTypes: ["Section", "Column"],

    fields: [
      { kind: "text", label: "Width",   path: "style.width",   placeholder: "e.g. 100% or 50%" },
      { kind: "text", label: "Padding", path: "style.padding", placeholder: "e.g. 16px" },
      { kind: "text", label: "Gap",     path: "style.gap",     placeholder: "e.g. 16px" },
      { kind: "select", label: "Layout", path: "props.layout", options: [
        { label: "Block", value: "block" },
        { label: "Flex",  value: "flex" },
        { label: "Grid",  value: "grid" },
      ]},
      { kind: "text", label: "Align Items", path: "style.alignItems", placeholder: "e.g. center" },
      { kind: "text", label: "Justify Content", path: "style.justifyContent", placeholder: "e.g. center" },
    ],

    render: (node: Node) => {
      const display =
        node.props?.layout === "flex" ? "flex" :
        node.props?.layout === "grid" ? "grid" : "block";

      return (
        <div
          style={{
            display,
            ...(node.style ?? {}),
          }}
        />
      );
    },

    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Column",
      props: { layout: "block" },
      style: { width: "100%", padding: "0" },
      children: [],
    }),
  };

  registerWidget(widget);
}
