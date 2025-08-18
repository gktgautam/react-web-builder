"use client";
import * as React from "react";
import { useEditorStore } from "../../store/createEditorStore";

export function BreakpointSwitcher() {
  const bp = useEditorStore((s) => s.activeBreakpoint);
  const set = useEditorStore((s) => s.setBreakpoint);
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
      {(["mobile","tablet","desktop"] as const).map(k => (
        <button
          key={k}
          onClick={() => set(k)}
          style={{
            padding: "6px 10px",
            border: "1px solid #e5e7eb",
            background: bp === k ? "#111827" : "#fff",
            color: bp === k ? "#fff" : "#111827",
            borderRadius: 6
          }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}
