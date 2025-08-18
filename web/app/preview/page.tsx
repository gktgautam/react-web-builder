"use client";
import * as React from "react";
import { Render } from "@editor/core";
import type { Node } from "@editor/core";

export default function Preview() {
  const [doc, setDoc] = React.useState<{ tree: Node } | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("rpb-doc");
      if (raw) setDoc(JSON.parse(raw));
    } catch {}
  }, []);

  if (!doc) return <div style={{ padding: 24 }}>No document to preview.</div>;
  return (
    <div style={{ padding: 24 }}>
      <Render doc={doc} />
    </div>
  );
}
