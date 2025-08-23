// packages/editor/src/index.ts

// types/schema
export type { Node } from "./schema";

// components
export { default as EditorLayout } from "./components/EditorLayout";

// widgets api (if consumers need to extend)
export * from "./widgets";

// store (optional external access)
export { useEditorStore } from "./store/createEditorStore";

// render for preview
export { Render } from "./render/Render";
