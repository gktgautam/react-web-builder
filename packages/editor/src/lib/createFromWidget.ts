import type { Node } from "../schema";
import { getWidget } from "../widgets/registry";

export function createFromWidget(widgetType: string): Node {
  const w = getWidget(widgetType);
  if (!w) throw new Error(`Unknown widget ${widgetType}`);
  return w.defaultNode();
}
