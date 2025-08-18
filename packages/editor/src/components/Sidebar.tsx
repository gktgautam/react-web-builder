"use client";
import * as React from "react";
import { WidgetPalette } from "../palette/WidgetPalette";
import { useEditorStore } from "../store/createEditorStore";

export function Sidebar() {
  const root = useEditorStore((s) => s.doc.tree);
  if (!root) return <aside style={{ width: 260, borderRight: "1px solid #e5e7eb", padding: 12 }}>Loading…</aside>;
  return <WidgetPalette parentId={root.id} />;
}
