"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerSpacerWidget() {
  const widget: Widget = {
    type: "Spacer",
    title: "Spacer",
    category: "Basic",
    isContainer: false,

    fields: [
      { kind: "number", label: "Height (px)", path: "props.size", min: 0, step: 1 },
    ],

    render: (node: Node) => {
      const size = Number(node.props?.size ?? 24);
      return <div style={{ height: `${size}px` }} />;
    },

    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Spacer",
      props: { size: 24 },
      style: {},
      children: [],
    }),
  };

  registerWidget(widget);
}
