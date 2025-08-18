"use client";
import dynamic from "next/dynamic";

// Load EditorLayout only on the client; no server HTML => no hydration mismatch
const EditorLayout = dynamic(
  () => import("@editor/core").then((m) => m.EditorLayout),
  { ssr: false }
);

export default function Page() {
  return <EditorLayout />;
}
