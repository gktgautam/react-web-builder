"use client";
import * as React from "react";
import { useEditorStore } from "../store/createEditorStore";
import type { Node } from "../schema";
import { getWidget } from "../widgets/registry";

function getNode(doc: any, id?: string): Node | null {
  if (!id) return null;
  const stack = [doc.tree] as Node[];
  while (stack.length) {
    const cur = stack.pop()!;
    if (cur.id === id) return cur;
    (cur.children ?? []).forEach((c) => stack.push(c));
  }
  return null;
}

function FieldInput({ nodeId, label, path, type, placeholder, rows }:{
  nodeId: string; label: string; path: string; type: "text" | "textarea" | "number" | "url" | "color"; placeholder?: string; rows?: number;
}) {
  const doc = useEditorStore((s) => s.doc);
  const update = useEditorStore((s) => s.updateByPath);
  const node = getNode(doc, nodeId);
  const value = path.split(".").reduce((o: any, k) => o?.[k], node) ?? "";

  if (type === "textarea") {
    return (
      <label style={{ display: "block", marginBottom: 8 }}>
        <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
        <textarea
          value={value}
          placeholder={placeholder}
          rows={rows ?? 4}
          onChange={(e) => update(nodeId, path, e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </label>
    );
  }

  return (
    <label style={{ display: "block", marginBottom: 8 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => update(nodeId, path, type === "number" ? Number(e.target.value) : e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />
    </label>
  );
}

export function PropertyPanel() {
  const doc = useEditorStore((s) => s.doc);
  const selectedId = useEditorStore((s) => s.selectedId);
  const node = getNode(doc, selectedId);
  const widget = node ? getWidget(node.type) : null;

  return (
    <aside style={{ width: 320, borderLeft: "1px solid #e5e7eb", background: "#fff", padding: 12, overflow: "auto" }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Properties</div>
      {!node ? (
        <div style={{ color: "#6b7280" }}>Nothing selected</div>
      ) : (
        <>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>{widget?.title ?? node.type}</div>
          {widget?.fields?.length ? (
            widget.fields.map((f, i) => {
              const kind = f.kind === "switch" ? "text" : (f.kind as any);
              const rows = (f as any).rows;
              return (
                <FieldInput
                  key={i}
                  nodeId={node.id}
                  label={f.label}
                  path={f.path}
                  type={kind}
                  placeholder={(f as any).placeholder}
                  rows={rows}
                />
              );
            })
          ) : (
            <div style={{ color: "#6b7280", fontSize: 12 }}>No content fields</div>
          )}

          <div style={{ height: 12 }} />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Style</div>
          {["width","maxWidth","height","margin","padding","background","border","borderRadius","boxShadow","color","fontSize","fontWeight","lineHeight","textAlign","display","gap","justifyContent","alignItems"].map((k) => (
            <label key={k} style={{ display: "block", marginBottom: 8 }}>
              <div style={{ fontSize: 12, marginBottom: 4 }}>{k}</div>
              <input
                type={k === "color" ? "color" : "text"}
                value={(node.style as any)?.[k] ?? ""}
                onChange={(e) => useEditorStore.getState().updateByPath(node.id, `style.${k}`, e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </label>
          ))}
        </>
      )}
    </aside>
  );
}
