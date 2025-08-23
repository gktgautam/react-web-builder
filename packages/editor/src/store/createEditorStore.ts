// packages/editor/src/store/createEditorStore.ts
"use client";
import { create } from "zustand";
import { produce } from "immer";
import { nanoid } from "nanoid";
import type { Node } from "../schema";

export type Breakpoint = "desktop" | "tablet" | "mobile";

type EditorState = {
  page: Node;
  selectedId: string | null;
  hoveredId: string | null;
  activeBreakpoint: Breakpoint;

  // actions
  selectNode(id: string | null): void;
  hoverNode(id: string | null): void;
  insertNode(parentId: string, child: Node, index?: number): void;
  addChild(parentId: string, child: Node, index?: number): void;
  moveNode(srcParentId: string, srcIndex: number, dstParentId: string, dstIndex: number): void;
  updateByPath(nodeId: string, path: string, value: any): void;
  loadPage(nextRoot: Node): void;
  setBreakpoint(bp: Breakpoint): void;
};

function initialPage(): Node {
  return {
    id: nanoid(),
    type: "Page",
    style: { width: "100%" },
    children: [],
  };
}

type Updater<T> = (draft: T) => void;

function findWithParent(root: Node, id: string): { parent: Node | null; index: number; node: Node | null } {
  if (root.id === id) return { parent: null, index: -1, node: root };
  const stack: Array<{ parent: Node; index: number; node: Node }> = [];
  const kids = root.children ?? [];
  for (let i = 0; i < kids.length; i++) stack.push({ parent: root, index: i, node: kids[i]! });
  while (stack.length) {
    const cur = stack.pop()!;
    if (cur.node.id === id) return cur;
    const ch = cur.node.children ?? [];
    for (let i = 0; i < ch.length; i++) stack.push({ parent: cur.node, index: i, node: ch[i]! });
  }
  return { parent: null, index: -1, node: null };
}

function insertChild(parent: Node, child: Node, index?: number) {
  if (!parent.children) parent.children = [];
  const i = index == null ? parent.children.length : Math.max(0, Math.min(index, parent.children.length));
  parent.children.splice(i, 0, child);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  page: initialPage(),
  selectedId: null,
  hoveredId: null,
  activeBreakpoint: "desktop",

  selectNode(id) { set({ selectedId: id }); },
  hoverNode(id) { set({ hoveredId: id }); },
  setBreakpoint(bp) { set({ activeBreakpoint: bp }); },

  insertNode(parentId, child, index) {
    set(produce<EditorState>((draft) => {
      if (!child.id) child.id = nanoid();
      const found = findWithParent(draft.page, parentId);
      const parent = (found.node && found.node.id === parentId) ? found.node : (found.parent && found.parent.id === parentId ? found.parent : null);
      const target = parent ?? (draft.page.id === parentId ? draft.page : null);
      if (!target) return;
      // clone child to avoid shared refs
      const toInsert: Node = JSON.parse(JSON.stringify(child));
      insertChild(target, toInsert, index);
    }));
  },

  addChild(parentId, child, index) {
    get().insertNode(parentId, child, index);
  },

  moveNode(srcParentId, srcIndex, dstParentId, dstIndex) {
    set(produce<EditorState>((draft) => {
      const srcParent = findWithParent(draft.page, srcParentId).node ?? draft.page;
      const dstParent = findWithParent(draft.page, dstParentId).node ?? draft.page;
      if (!srcParent || !dstParent || !srcParent.children || !dstParent.children) return;
      const [moved] = srcParent.children.splice(srcIndex, 1);
      if (!moved) return;
      const i = Math.max(0, Math.min(dstIndex, dstParent.children.length));
      dstParent.children.splice(i, 0, moved);
    }));
  },

  updateByPath(nodeId, path, value) {
    set(produce<EditorState>((draft) => {
      const { node } = findWithParent(draft.page, nodeId);
      if (!node) return;
      const keys = path.split(".");
      let cur: any = node as any;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i]!;
        if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
        cur = cur[k];
      }
      cur[keys[keys.length - 1]!] = value;
    }));
  },

  loadPage(nextRoot) { set({ page: JSON.parse(JSON.stringify(nextRoot)), selectedId: null, hoveredId: null }); },
}));
