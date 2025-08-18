"use client";
import * as React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useEditorStore } from "../store/createEditorStore";
import { Sidebar } from "./Sidebar";
import { EditorCanvas } from "./EditorCanvas";
import { LayersPanel } from "./LayersPanel";
import { PropertyPanel } from "./PropertyPanel";
import { registerDefaultWidgets } from "../widgets";
import { makeOnDragEnd } from "../dnd/handlers";
import { createFromWidget } from "../lib/createFromWidget";

export default function EditorLayout() {
  React.useEffect(() => {
    if (!(globalThis as any).__widgets_registered__) {
      registerDefaultWidgets();
      (globalThis as any).__widgets_registered__ = true;
    }
  }, []);

  const moveNode = useEditorStore((s) => s.moveNode);
  const addChild = useEditorStore((s) => s.addChild);
  const onDragEnd = makeOnDragEnd({ moveNode, addChild, createFromWidget });

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <EditorCanvas />
        <LayersPanel />
        <PropertyPanel />
      </div>
    </DndContext>
  );
}
