// packages/editor/src/store/createEditorStore.ts
"use client";
import { create } from "zustand";
import { produce } from "immer";
import { nanoid } from "nanoid";
// Import your local schema Node type (no @schema/core in the 2-repo setup)
import type { Node } from "../schema";

export type Breakpoint = "desktop" | "tablet" | "mobile";

type Updater<T> = (draft: T) => void;

function deepClone<T>(val: T): T {
  // structuredClone where available; fallback for older browsers
  if (typeof (globalThis as any).structuredClone === "function") {
    return (globalThis as any).structuredClone(val);
  }
  return JSON.parse(JSON.stringify(val));
}

/** Find a node by id, and also return its parent + index. */
function findWithParent(root: Node, id: string): {
  node: Node | null;
  parent: Node | null;
  index: number;
} {
  if (root.id === id) return { node: root, parent: null, index: -1 };
  const stack: Array<{ parent: Node | null; node: Node }> = [{ parent: null, node: root }];
  while (stack.length) {
    const { node, parent } = stack.pop()!;
    const children = node.children ?? [];
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (c.id === id) return { node: c, parent: node, index: i };
      stack.push({ node: c, parent: node });
    }
  }
  return { node: null, parent: null, index: -1 };
}

/** Find a node by id only. */
function findNode(root: Node, id?: string | null): Node | null {
  if (!id) return null;
  return findWithParent(root, id).node;
}

/** Insert a child into a parent’s children at an index. */
function insertChild(parent: Node, child: Node, index?: number) {
  if (!parent.children) parent.children = [];
  const pos = index === undefined ? parent.children.length : Math.max(0, Math.min(index, parent.children.length));
  parent.children.splice(pos, 0, child);
}

 

export type EditorState = {
  // document root (your Page node)
  page: Node;

  // UI state
  selectedId: string | null;
  hoveredId: string | null;
  activeBreakpoint: Breakpoint;

  // selectors
  getSelected(): Node | null;

  // actions
  selectNode(id: string | null): void;
  hoverNode(id: string | null): void;
  setBreakpoint(bp: Breakpoint): void;

  /** Insert a node under parentId at optional index (default append). */
  insertNode(parentId: string, child: Node, index?: number): void;

  /** Backwards compatibility: addChild just calls insertNode. */
  addChild(parentId: string, child: Node, index?: number): void;

  /** Move an existing child: from (srcParentId, srcIndex) -> (dstParentId, dstIndex). */
  moveNode(srcParentId: string, srcIndex: number, dstParentId: string, dstIndex: number): void;

  /** Remove a node by id. */
  removeNode(id: string): void;

  /** Update a deep path on a node by id (e.g., "props.text" or "style.width"). */
  updateByPath(nodeId: string, path: string, value: any): void;

  /** Replace entire page (e.g., when loading a template). */
  loadPage(nextRoot: Node): void;
};

const initialPage: Node = {
  id: "root",
  type: "Page",
  props: { style: { maxWidth: "1024px", margin: "0 auto", padding: "24px" } },
  children: [],
};

export const useEditorStore = create<EditorState>((set, get) => ({
  // state
  page: initialPage,
  selectedId: null,
  hoveredId: null,
  activeBreakpoint: "desktop",

  // selectors
  getSelected() {
    const s = get();
    return findNode(s.page, s.selectedId);
  },

  // ui actions
  selectNode(id) {
    set({ selectedId: id });
  },
  hoverNode(id) {
    set({ hoveredId: id });
  },
  setBreakpoint(bp) {
    set({ activeBreakpoint: bp });
  },

  // core actions
  insertNode(parentId, child, index) {
    set(
      produce<EditorState>((draft) => {
        // Ensure an id
        if (!child.id) child.id = nanoid();

        const { node: parent } = findWithParent(draft.page, parentId);
        if (!parent) return; // parent not found -> no-op

        // Avoid accidental shared references
        const toInsert = deepClone(child);
        insertChild(parent, toInsert, index);
      })
    );
  },

  addChild(parentId, child, index) {
    // alias to insertNode to keep both call sites working
    get().insertNode(parentId, child, index);
  },

  moveNode(srcParentId, srcIndex, dstParentId, dstIndex) {
    set(
      produce<EditorState>((draft) => {
        const { node: srcParent } = findWithParent(draft.page, srcParentId);
        const { node: dstParent } = findWithParent(draft.page, dstParentId);
        if (!srcParent || !dstParent) return;

        const srcChildren = srcParent.children ?? [];
        if (srcIndex < 0 || srcIndex >= srcChildren.length) return;

        const [moved] = srcChildren.splice(srcIndex, 1);
        if (!moved) return;

        if (!dstParent.children) dstParent.children = [];
        const pos = Math.max(0, Math.min(dstIndex, dstParent.children.length));
        dstParent.children.splice(pos, 0, moved);
      })
    );
  },

  removeNode(id) {
    set(
      produce<EditorState>((draft) => {
        if (draft.page.id === id) return; // don't remove root
        const { parent, index } = findWithParent(draft.page, id);
        if (!parent || index < 0) return;
        parent.children!.splice(index, 1);
        if (draft.selectedId === id) draft.selectedId = null;
        if (draft.hoveredId === id) draft.hoveredId = null;
      })
    );
  },

  updateByPath(nodeId, path, value) {
    set(
      produce<EditorState>((draft) => {
        const n = findNode(draft.page, nodeId);
        if (!n) return;
        const keys = path.split(".");
        let cur: any = n;
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i]!;
          if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
          cur = cur[k];
        }
        cur[keys[keys.length - 1]!] = value;
      })
    );
  },

  loadPage(nextRoot) {
    set({ page: deepClone(nextRoot), selectedId: null, hoveredId: null });
  },
}));
