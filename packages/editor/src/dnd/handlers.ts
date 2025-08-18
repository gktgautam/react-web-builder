import type { Node } from "../schema";

type MoveNode = (srcParentId: string, srcIndex: number, dstParentId: string, dstIndex: number) => void;
type AddChild = (parentId: string, node: Node, index?: number) => void;
type CreateFromWidget = (widgetType: string) => Node;

export function makeOnDragEnd(opts: {
  moveNode: MoveNode;
  addChild: AddChild;
  createFromWidget: CreateFromWidget;
}) {
  const { moveNode, addChild, createFromWidget } = opts;

  return (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const payload = active?.data?.current;
    const drop = over?.data?.current;
    if (!payload || !drop) return;

    // Dragging from palette
    if (payload.kind === "widget") {
      const node = createFromWidget(payload.widgetType);
      addChild(drop.parentId, node, drop.index);
      return;
    }

    // (Optional) dragging existing nodes can be wired similarly
  };
}
