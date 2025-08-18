"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Field } from "./registry";

export function registerHeadingWidget() {
  registerWidget({
    type: "Heading",
    title: "Heading",
    category: "Basic",
    fields: [
      { kind: "text", label: "Text", path: "props.text", placeholder: "Your heading" }
    ] as Field[],
    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Heading",
      props: { text: "Heading" },
      style: { fontSize: "28px", fontWeight: 700, margin: "6px 0" }
    }),
    render: (node) => <h2 style={node.style}>{node.props?.text ?? "Heading"}</h2>
  });
}
