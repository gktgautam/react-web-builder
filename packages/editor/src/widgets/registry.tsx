"use client";
import * as React from "react";
import type { Node } from "../schema";

export type Field =
  | { kind: "text"; label: string; path: string; placeholder?: string }
  | { kind: "textarea"; label: string; path: string; placeholder?: string; rows?: number }
  | { kind: "number"; label: string; path: string; min?: number; max?: number; step?: number }
  | { kind: "select"; label: string; path: string; options: Array<{ label: string; value: string }> }
  | { kind: "switch"; label: string; path: string }
  | { kind: "color"; label: string; path: string }
  | { kind: "url"; label: string; path: string; placeholder?: string };

export type Widget = {
  type: string;
  title: string;
  category: "Layout" | "Basic" | "Media" | "Marketing" | "Other";
  icon?: React.ReactNode;
  fields: Field[];
  render: (node: Node) => React.ReactNode;
  defaultNode: () => Node;
  acceptsChildTypes?: string[];
  allowedParentTypes?: string[];
  isContainer?: boolean;
};

const registry = new Map<string, Widget>();

export function registerWidget(widget: Widget) {
  registry.set(widget.type, widget);
}

export function getWidget(type: string) {
  return registry.get(type);
}

export type WidgetCategory = "Layout" | "Basic" | "Media" | "Marketing" | "Other";

export function widgetsByCategory(): Record<WidgetCategory, Widget[]> {
  const out: Record<WidgetCategory, Widget[]> = {
    Layout: [], Basic: [], Media: [], Marketing: [], Other: []
  };
  for (const w of registry.values()) out[w.category].push(w);
  (Object.keys(out) as WidgetCategory[]).forEach(k => out[k].sort((a,b)=>a.title.localeCompare(b.title)));
  return out;
}
