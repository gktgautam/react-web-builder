// packages/editor/src/components/FieldControl.tsx
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
  const page = useEditorStore((s) => s.page);

  const node = React.useMemo(() => {
    // simple DFS to find node by id
    const stack: any[] = [page];
    while (stack.length) {
      const cur = stack.pop();
      if (!cur) continue;
      if (cur.id === nodeId) return cur;
      const kids = Array.isArray(cur.children) ? cur.children : [];
      for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
    }
    return null;
  }, [page, nodeId]);

  const value = node ? getByPath(node, field.path) : undefined;
  const wrap: React.CSSProperties = { display: "block", marginBottom: 10 };
  const label = <div style={{ fontSize: 12, marginBottom: 4 }}>{field.label}</div>;
  const inputStyle: React.CSSProperties = { width: "100%", padding: 8 };

  const onChange = (v: any) => updateByPath(nodeId, field.path, v);

  switch (field.kind) {
    case "text":
    case "url":
      return (
        <label style={wrap}>
          {label}
          <input
            type={field.kind === "url" ? "url" : "text"}
            value={value ?? ""}
            placeholder={(field as any).placeholder}
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
            placeholder={(field as any).placeholder}
            rows={(field as any).rows ?? 4}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>
      );

    case "number": {
      const f = field as any;
      return (
        <label style={wrap}>
          {label}
          <input
            type="number"
            value={value ?? 0}
            min={f.min}
            max={f.max}
            step={f.step}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            style={inputStyle}
          />
        </label>
      );
    }

    case "select": {
      const f = field as any;
      return (
        <label style={wrap}>
          {label}
          <select
            value={value ?? (f.options?.[0]?.value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            style={inputStyle}
          >
            {f.options?.map((o: any) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      );
    }

    case "switch":
      return (
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span style={{ fontSize: 12 }}>{field.label}</span>
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
            style={{ width: 40, height: 28, padding: 0, border: "none", background: "transparent" }}
          />
        </label>
      );

    default:
      return null;
  }
}
