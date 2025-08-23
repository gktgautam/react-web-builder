// packages/editor/src/widgets/image.tsx
"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Widget } from "./registry";

export function registerImageWidget() {
  const widget: Widget = {
    type: "Image",
    title: "Image",
    category: "Media",
    isContainer: false,
    fields: [
      { kind: "url",   label: "Image URL", path: "props.src", placeholder: "https://..." },
      { kind: "text",  label: "Alt text",  path: "props.alt", placeholder: "Describe the image" },
      { kind: "text",  label: "Width",     path: "style.width", placeholder: "e.g. 100% or 320px" },
    ],
    render(node) {
      const src = (node as any).props?.src ?? "https://picsum.photos/seed/rwb/800/400";
      const alt = (node as any).props?.alt ?? "";
      const style = (node as any).style ?? {};
      return <img src={src} alt={alt} style={style} />;
    },
    defaultNode(): Node {
      return {
        id: nanoid(),
        type: "Image",
        props: { src: "https://picsum.photos/seed/rwb/800/400", alt: "" },
        style: { width: "100%", display: "block", borderRadius: "8px" },
        children: [],
      };
    },
  };
  registerWidget(widget);
}
