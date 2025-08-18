"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerSectionWidget() {
  const widget: Widget = {
    type: "Section",
    title: "Section",
    category: "Layout",
    isContainer: true,
    acceptsChildTypes: ["Column"],

    fields: [
      { kind: "text", label: "Max Width", path: "style.maxWidth", placeholder: "e.g. 1200px" },
      { kind: "text", label: "Padding",   path: "style.padding",  placeholder: "e.g. 40px 20px" },
      { kind: "color", label: "Background", path: "style.background" }
    ],

    render: (node: Node) => {
      return (
        <section
          style={{
            margin: "0 auto",
            width: "100%",
            ...(node.style ?? {}),
          }}
        />
      );
    },

    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Section",
      style: {
        maxWidth: "1200px",
        padding: "40px 20px",
        background: "#ffffff",
      },
      props: {},
      children: [
        {
          id: nanoid(),
          type: "Column",
          style: { display: "block" },
          props: {},
          children: [],
        },
      ],
    }),
  };

  registerWidget(widget);
}
