"use client";
import * as React from "react";
import { useEditorStore } from "../store/createEditorStore";
import type { Field } from "../widgets/registry";

/** Read a nested value from an object using a dot-path */
function getByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function FieldControl({ nodeId, field }: { nodeId: string; field: Field }) {
  const updateByPath = useEditorStore((s) => s.updateByPath);
  const page = useEditorStore((s) => s.page); // if your store exposes doc.tree, change to s.doc.tree

  // find the node so we can show the current value
  const node = React.useMemo(() => {
    if (!page) return null;
    const stack = [page];
    while (stack.length) {
      const cur = stack.pop();
      if (!cur) continue;
      if (cur.id === nodeId) return cur;
      (cur.children ?? []).forEach((c) => c && stack.push(c));
    }
    return null;
  }, [page, nodeId]);

  const value = node ? getByPath(node, field.path) : undefined;

  const label = (
    <div style={{ fontSize: 12, marginBottom: 4 }}>
      {field.label}
    </div>
  );
  const wrap: React.CSSProperties = { display: "block", marginBottom: 12 };
  const inputStyle: React.CSSProperties = { width: "100%", padding: 8 };

  const onChange = (v: any) => updateByPath(nodeId, field.path, v);

  switch (field.kind) {
    case "text":
      return (
        <label style={wrap}>
          {label}
          <input
            type="text"
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
        </label>
      );

    case "textarea":
      return (
        <label style={wrap}>
          {label}
          <textarea
            value={value ?? ""}
            placeholder={field.placeholder}
            rows={field.rows ?? 4}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, minHeight: 80 }}
          />
        </label>
      );

    case "number":
      return (
        <label style={wrap}>
          {label}
          <input
            type="number"
            value={value ?? ""}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            style={inputStyle}
          />
        </label>
      );

    case "select":
      return (
        <label style={wrap}>
          {label}
          <select
            value={value ?? (field.options[0]?.value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      );

    case "switch":
      return (
        <label style={{ ...wrap, display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span style={{ fontSize: 13 }}>{field.label}</span>
        </label>
      );

    case "color":
      return (
        <label style={wrap}>
          {label}
          <input
            type="color"
            value={value ?? "#000000"}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: "100%", height: 32 }}
          />
        </label>
      );

    case "url":
      return (
        <label style={wrap}>
          {label}
          <input
            type="url"
            value={value ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          />
        </label>
      );

    default:
      return (
        <div style={wrap}>
          {label}
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Unsupported field kind: {(field as any).kind}
          </div>
        </div>
      );
  }
}
