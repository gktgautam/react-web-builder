// packages/editor/src/components/Sidebar.tsx
"use client";
import * as React from "react";
import { WidgetPalette } from "../palette/WidgetPalette";
import { useEditorStore } from "../store/createEditorStore";

export function Sidebar() {
  const rootId = useEditorStore((s) => s.page.id);
  return <WidgetPalette parentId={rootId} />;
}
