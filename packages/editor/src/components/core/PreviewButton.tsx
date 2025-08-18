"use client";
import * as React from "react";
import { useEditorStore } from "../../store/createEditorStore";

export function PreviewButton() {
  const page = useEditorStore((s) => s.page);

  const openPreview = () => {
    // save to localStorage for the preview tab to read
    localStorage.setItem("rpb-doc", JSON.stringify(page));
    window.open("/preview", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={openPreview}
      style={{
        padding: "8px 12px",
        background: "#111827",
        color: "#fff",
        borderRadius: 8,
        border: "1px solid #111827"
      }}
    >
      Preview
    </button>
  );
}
