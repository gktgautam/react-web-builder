"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import type { Node } from "../schema";
import { registerWidget, type Field } from "./registry";

export function registerSpacerWidget() {
  registerWidget({
    type: "Spacer",
    title: "Spacer",
    category: "Basic",
    fields: [
      { kind: "number", label: "Height (px)", path: "props.h", min: 0, step: 4 }
    ] as Field[],
    defaultNode: (): Node => ({
      id: nanoid(),
      type: "Spacer",
      props: { h: 24 },
      style: {}
    }),
    render: (node) => <div style={{ height: `${node.props?.h ?? 24}px` }} />
  });
}
