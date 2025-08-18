"use client";
import { create } from "zustand";
import { nanoid } from "nanoid";
import { produce } from "immer";
import type { Node } from "../schema";

export type Breakpoint = "desktop" | "tablet" | "mobile";

type Doc = { tree: Node };

export type EditorState = {
  doc: Doc;
  selectedId: string | null;
  hoveredId: string | null;
  activeBreakpoint: Breakpoint;

  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;
  setBreakpoint: (bp: Breakpoint) => void;

  addChild: (parentId: string, node: Node, index?: number) => void;
  moveNode: (srcParentId: string, srcIndex: number, dstParentId: string, dstIndex: number) => void;
  updateByPath: (id: string, path: string, value: any) => void;
  removeNode: (id: string) => void;
};

function ensureChildren(n: Node) { if (!n.children) n.children = []; return n.children; }

function findNode(root: Node, id: string): { node: Node; parent: Node | null; index: number } | null {
  if (root.id === id) return { node: root, parent: null, index: -1 };
  const stack: Array<{ parent: Node | null; node: Node }> = [{ parent: null, node: root }];
  while (stack.length) {
    const { parent, node } = stack.pop()!;
    if (node.id === id) {
      let index = -1;
      if (parent && parent.children) index = parent.children.findIndex((c) => c.id === id);
      return { node, parent, index };
    }
    (node.children ?? []).forEach((child) => stack.push({ parent: node, node: child }));
  }
  return null;
}

function findNodeById(root: Node, id: string): Node | null {
  const res = findNode(root, id);
  return res ? res.node : null;
}

function setByPath(obj: any, path: string, value: any) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i]!;
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]!] = value;
}

const initialDoc: Doc = {
  tree: {
    id: nanoid(),
    type: "Page",
    props: {},
    style: { maxWidth: "1024px", margin: "0 auto", padding: "24px" },
    children: []
  }
};

export const useEditorStore = create<EditorState>((set, get) => ({
  doc: initialDoc,
  selectedId: null,
  hoveredId: null,
  activeBreakpoint: "desktop",

  selectNode: (id) => set({ selectedId: id }),
  hoverNode: (id) => set({ hoveredId: id }),
  setBreakpoint: (bp) => set({ activeBreakpoint: bp }),

  addChild: (parentId, node, index) =>
    set(produce<EditorState>((draft) => {
      const parent = findNodeById(draft.doc.tree, parentId);
      if (!parent) return;
      const safeNode: Node = {
        id: node.id ?? nanoid(),
        type: node.type,
        props: node.props ? { ...node.props } : {},
        style: node.style ? { ...node.style } : undefined,
        children: node.children ? [...node.children] : []
      };
      const list = ensureChildren(parent);
      const at = typeof index === "number" ? Math.max(0, Math.min(index, list.length)) : list.length;
      list.splice(at, 0, safeNode);
      draft.selectedId = safeNode.id;
    })),

  moveNode: (srcParentId, srcIndex, dstParentId, dstIndex) =>
    set(produce<EditorState>((draft) => {
      const srcParent = findNodeById(draft.doc.tree, srcParentId);
      const dstParent = findNodeById(draft.doc.tree, dstParentId);
      if (!srcParent || !dstParent) return;
      const srcChildren = ensureChildren(srcParent);
      const dstChildren = ensureChildren(dstParent);
      if (srcIndex < 0 || srcIndex >= srcChildren.length) return;
      const [moved] = srcChildren.splice(srcIndex, 1);
      let insertAt = dstIndex;
      if (srcParentId === dstParentId && dstIndex > srcIndex) insertAt = dstIndex - 1;
      insertAt = Math.max(0, Math.min(insertAt, dstChildren.length));
      dstChildren.splice(insertAt, 0, moved);
      draft.selectedId = moved.id;
    })),

  updateByPath: (id, path, value) =>
    set(produce<EditorState>((draft) => {
      const target = findNodeById(draft.doc.tree, id);
      if (!target) return;
      setByPath(target, path, value);
    })),

  removeNode: (id) =>
    set(produce<EditorState>((draft) => {
      const found = findNode(draft.doc.tree, id);
      if (!found) return;
      const { parent, index } = found;
      if (!parent || index < 0) return;
      parent.children!.splice(index, 1);
      if (draft.selectedId === id) draft.selectedId = null;
    }))
}));
