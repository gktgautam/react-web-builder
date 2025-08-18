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
      { kind: "url",   label: "Src", path: "props.src", placeholder: "https://..." },
      { kind: "text",  label: "Alt", path: "props.alt", placeholder: "Describe the image" },
      { kind: "text",  label: "Width", path: "style.width", placeholder: "e.g. 100% or 400px" },
      { kind: "text",  label: "Height", path: "style.height", placeholder: "e.g. auto or 300px" },
      { kind: "text",  label: "Border Radius", path: "style.borderRadius", placeholder: "e.g. 8px" },
      { kind: "text",  label: "Object Fit", path: "style.objectFit", placeholder: "cover|contain" },
    ],

    render: (node: Node) => {
      const { src, alt } = node.props ?? {};
      return (
        <img
          src={src || "https://via.placeholder.com/800x400?text=Image"}
          alt={alt || ""}
          style={{ display: "block", maxWidth: "100%", height: "auto", ...(node.style ?? {}) }}
        />
      );
    },

    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Image",
      props: {
        src: "https://via.placeholder.com/800x400?text=Image",
        alt: "Placeholder image",
      },
      style: { width: "100%", height: "auto", borderRadius: "0px" },
      children: [],
    }),
  };

  registerWidget(widget);
}
