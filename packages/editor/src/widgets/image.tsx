"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Field } from "./registry";

export function registerImageWidget() {
  registerWidget({
    type: "Image",
    title: "Image",
    category: "Media",
    fields: [
      { kind: "url", label: "Src", path: "props.src", placeholder: "https://…" },
      { kind: "text", label: "Alt", path: "props.alt", placeholder: "Description" }
    ] as Field[],
    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Image",
      props: { src: "https://picsum.photos/800/400", alt: "Image" },
      style: { width: "100%", height: "auto", borderRadius: "8px" }
    }),
    render: (node) => <img src={node.props?.src} alt={node.props?.alt ?? ""} style={node.style} />
  });
}
