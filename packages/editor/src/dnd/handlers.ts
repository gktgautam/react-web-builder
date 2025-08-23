// packages/editor/src/dnd/handlers.ts
import type { DragEndEvent } from "@dnd-kit/core";
import type { Node } from "../schema";

type MoveNode = (srcParentId: string, srcIndex: number, dstParentId: string, dstIndex: number) => void;
type AddChild = (parentId: string, node: Node, index?: number) => void;
type CreateFromWidget = (widgetType: string) => Node;
type GetPage = () => Node;

export function makeOnDragEnd(opts: {
  moveNode: MoveNode;
  addChild: AddChild;
  createFromWidget: CreateFromWidget;
  getPage: GetPage;
}) {
  const { moveNode, addChild, createFromWidget } = opts;

  return (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const payload = (active.data?.current ?? {}) as any;
    const drop = (over.data?.current ?? {}) as any;
    if (!drop || typeof drop.parentId !== "string") return;

    // New widget from palette
    if (payload.kind === "widget" && typeof payload.widgetType === "string") {
      const node = createFromWidget(payload.widgetType);
      addChild(drop.parentId, node, drop.index);
      return;
    }

    // Existing node move (optional, enable when draggable nodes are added)
    if (payload.kind === "node"
        && typeof payload.srcParentId === "string"
        && typeof payload.srcIndex === "number") {
      moveNode(payload.srcParentId, payload.srcIndex, drop.parentId, drop.index ?? 0);
      return;
    }
  };
}
