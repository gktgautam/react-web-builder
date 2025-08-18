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
      { kind: "text",   label: "Text",   path: "props.text",       placeholder: "Your headline" },
      { kind: "select", label: "Tag",    path: "props.tag",        options: [
        { label: "H1", value: "h1" }, { label: "H2", value: "h2" },
        { label: "H3", value: "h3" }, { label: "H4", value: "h4" },
      ]},
      { kind: "color",  label: "Color",  path: "style.color" },
      { kind: "text",   label: "Size",   path: "style.fontSize",   placeholder: "e.g. 32px" },
      { kind: "text",   label: "Weight", path: "style.fontWeight", placeholder: "e.g. 700" },
      { kind: "text",   label: "Align",  path: "style.textAlign",  placeholder: "left|center|right" },
      { kind: "text",   label: "Margin", path: "style.margin",     placeholder: "e.g. 0 0 8px" },
    ],

    render: (node: Node) => {
      const Tag = (node.props?.tag as any) || "h2";
      return <Tag style={node.style}>{node.props?.text ?? "Heading"}</Tag>;
    },

    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Heading",
      props: { text: "Your headline", tag: "h2" },
      style: { fontSize: "32px", fontWeight: "700", margin: "0 0 8px" },
      children: [],
    }),
  };

  registerWidget(widget);
}
